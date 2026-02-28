import logging
import httpx
from fastapi import FastAPI, Response, Form, Query
from twilio.twiml.voice_response import VoiceResponse, Gather

# Logging to see if requests hit your server
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# FIXED COORDINATES FOR PANYAM
PANYAM_LAT = 15.52
PANYAM_LON = 78.35

def twiml_response(vr: VoiceResponse):
    xml_content = str(vr)
    print(f"\n[Outgoing TwiML]\n{xml_content}\n")
    return Response(content=xml_content, media_type="application/xml")

# --- STEP 1: START & ASK LOCATION (Voice) ---
@app.post("/voice")
async def ask_location():
    logger.info(">>> TWILIO HIT: /voice")
    vr = VoiceResponse()
    gather = Gather(input='speech dtmf', action='/process-location', timeout=5, finish_on_key='#')
    gather.say("Welcome. Please speak your location name, then press hash.")
    vr.append(gather)
    return twiml_response(vr)

# --- STEP 2: PROCESS LOCATION -> NITROGEN ---
@app.post("/process-location")
async def process_location(SpeechResult: str = Form(None)):
    logger.info(f"Location Spoken: {SpeechResult}")
    vr = VoiceResponse()
    loc = SpeechResult if SpeechResult else "Panyam"
    gather = Gather(input='dtmf', action=f'/process-n?loc={loc}', timeout=5, num_digits=3, finish_on_key='#')
    gather.say(f"Recording data for {loc}. Enter Nitrogen value, then press hash.")
    vr.append(gather)
    return twiml_response(vr)

# --- STEP 3: NITROGEN -> PHOSPHORUS ---
@app.post("/process-n")
async def process_n(loc: str, Digits: str = Form(None)):
    vr = VoiceResponse()
    gather = Gather(input='dtmf', action=f'/process-p?loc={loc}&n={Digits}', timeout=5, num_digits=3, finish_on_key='#')
    gather.say(f"Nitrogen {Digits} recorded. Enter Phosphorus, then press hash.")
    vr.append(gather)
    return twiml_response(vr)

# --- STEP 4: PHOSPHORUS -> POTASSIUM ---
@app.post("/process-p")
async def process_p(loc: str, n: str, Digits: str = Form(None)):
    vr = VoiceResponse()
    gather = Gather(input='dtmf', action=f'/process-k?loc={loc}&n={n}&p={Digits}', timeout=5, num_digits=3, finish_on_key='#')
    gather.say(f"Phosphorus {Digits} recorded. Enter Potassium, then press hash.")
    vr.append(gather)
    return twiml_response(vr)

# --- STEP 5: POTASSIUM -> pH ---
@app.post("/process-k")
async def process_k(loc: str, n: str, p: str, Digits: str = Form(None)):
    vr = VoiceResponse()
    gather = Gather(input='dtmf', action=f'/process-ph?loc={loc}&n={n}&p={p}&k={Digits}', timeout=5, num_digits=2, finish_on_key='#')
    gather.say(f"Potassium {Digits} recorded. Enter two digit p H value, then press hash.")
    vr.append(gather)
    return twiml_response(vr)

# --- STEP 6: FINAL RESULT (OpenMeteo + Model) ---
@app.post("/process-ph")
async def process_ph(loc: str, n: float, p: float, k: float, Digits: str = Form(None)):
    ph = float(Digits) if Digits else 7.0
    vr = VoiceResponse()
    try:
        weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={PANYAM_LAT}&longitude={PANYAM_LON}&current_weather=true"
        async with httpx.AsyncClient() as client:
            resp = await client.get(weather_url)
            data = resp.json()
            temp = data['current_weather']['temperature']

        # Simple logic: If Ph is low, Rice. Else, Maize.
        crop = "Rice" if ph < 7 else "Maize"

        vr.say(f"our model recommends {crop}. Goodbye.")
    except Exception as e:
        logger.error(f"Error: {e}")
        vr.say("Error processing results. Goodbye.")
    
    vr.hangup()
    return twiml_response(vr)