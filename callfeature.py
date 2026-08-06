import logging
import httpx
from fastapi import FastAPI, Response, Form, Query
from twilio.twiml.voice_response import VoiceResponse, Gather

# Logging to monitor Twilio hits in your terminal
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# 1. UPDATE THIS to match your active ngrok URL
BASE_URL = "https://untauntingly-disclamatory-rutha.ngrok-free.dev"

# Coordinates for Panyam
PANYAM_LAT = 15.52
PANYAM_LON = 78.35

def twiml_response(vr: VoiceResponse):
    """Helper to return TwiML XML response."""
    xml_content = str(vr)
    print(f"\n[Outgoing TwiML]\n{xml_content}\n")
    return Response(content=xml_content, media_type="application/xml")

# --- STEP 1: START & ASK LOCATION ---
@app.post("/voice")
async def ask_location():
    logger.info(">>> STEP 1: Start Call")
    vr = VoiceResponse()
    # Absolute URL prevents 404 errors on the first hop
    action_url = f"{BASE_URL}/process-location"
    gather = Gather(input='speech dtmf', action=action_url, timeout=5, finish_on_key='#')
    gather.say("Welcome. Please speak your location name, then press hash.")
    vr.append(gather)
    
    # Redirection prevents hangup if user is silent
    vr.redirect(f"{BASE_URL}/voice")
    return twiml_response(vr)

# --- STEP 2: PROCESS LOCATION -> NITROGEN ---
@app.post("/process-location")
async def process_location(SpeechResult: str = Form(None), Digits: str = Form(None)):
    loc = SpeechResult if SpeechResult else (Digits if Digits else "Panyam")
    logger.info(f">>> STEP 2: Location is {loc}")
    
    vr = VoiceResponse()
    action_url = f'{BASE_URL}/process-n?loc={loc}'
    gather = Gather(input='dtmf', action=action_url, timeout=5, num_digits=3, finish_on_key='#')
    gather.say(f"Recording data for {loc}. Enter Nitrogen value, then press hash.")
    vr.append(gather)
    
    vr.redirect(f"{BASE_URL}/process-location?SpeechResult={loc}")
    return twiml_response(vr)

# --- STEP 3: NITROGEN -> PHOSPHORUS ---
@app.post("/process-n")
async def process_n(loc: str = Query(...), Digits: str = Form(None)):
    n_val = Digits if Digits else "0"
    logger.info(f">>> STEP 3: Nitrogen is {n_val}")
    
    vr = VoiceResponse()
    action_url = f'{BASE_URL}/process-p?loc={loc}&n={n_val}'
    gather = Gather(input='dtmf', action=action_url, timeout=5, num_digits=3, finish_on_key='#')
    gather.say(f"Nitrogen {n_val} recorded. Enter Phosphorus value, then press hash.")
    vr.append(gather)
    
    vr.redirect(f"{BASE_URL}/process-n?loc={loc}")
    return twiml_response(vr)

# --- STEP 4: PHOSPHORUS -> POTASSIUM ---
@app.post("/process-p")
async def process_p(loc: str = Query(...), n: str = Query(...), Digits: str = Form(None)):
    p_val = Digits if Digits else "0"
    logger.info(f">>> STEP 4: Phosphorus is {p_val}")
    
    vr = VoiceResponse()
    action_url = f'{BASE_URL}/process-k?loc={loc}&n={n}&p={p_val}'
    gather = Gather(input='dtmf', action=action_url, timeout=5, num_digits=3, finish_on_key='#')
    gather.say(f"Phosphorus {p_val} recorded. Enter Potassium value, then press hash.")
    vr.append(gather)
    
    vr.redirect(f"{BASE_URL}/process-p?loc={loc}&n={n}")
    return twiml_response(vr)

# --- STEP 5: POTASSIUM -> pH ---
@app.post("/process-k")
async def process_k(loc: str = Query(...), n: str = Query(...), p: str = Query(...), Digits: str = Form(None)):
    k_val = Digits if Digits else "0"
    logger.info(f">>> STEP 5: Potassium is {k_val}")
    
    vr = VoiceResponse()
    action_url = f'{BASE_URL}/process-ph?loc={loc}&n={n}&p={p}&k={k_val}'
    gather = Gather(input='dtmf', action=action_url, timeout=5, num_digits=2, finish_on_key='#')
    gather.say(f"Potassium {k_val} recorded. Enter two digit p H value, then press hash.")
    vr.append(gather)
    
    vr.redirect(f"{BASE_URL}/process-k?loc={loc}&n={n}&p={p}")
    return twiml_response(vr)

# --- STEP 6: FINAL RESULT ---
@app.post("/process-ph")
async def process_ph(
    loc: str = Query(...), n: str = Query(...), p: str = Query(...), k: str = Query(...), Digits: str = Form(None)
):
    ph_val = Digits if (Digits and Digits.isdigit()) else "7"
    logger.info(f">>> STEP 6: pH is {ph_val}")
    
    vr = VoiceResponse()
    try:
        # Fetching live weather
        weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={PANYAM_LAT}&longitude={PANYAM_LON}&current_weather=true"
        async with httpx.AsyncClient() as client:
            resp = await client.get(weather_url)
            weather_data = resp.json()
            temp = weather_data['current_weather']['temperature']

        crop = "Rice" if float(ph_val) < 7 else "Maize"
        vr.say(f"At {loc}, with nitrogen {n} and p H {ph_val}. The temperature is {temp} degrees.")
        vr.say(f"Our model recommends {crop}. Thank you for calling. Goodbye.")
    except Exception as e:
        logger.error(f"Error: {e}")
        vr.say("Error processing results. Goodbye.")
    
    vr.hangup()
    return twiml_response(vr)