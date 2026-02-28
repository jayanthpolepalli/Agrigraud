import logging
from fastapi import FastAPI, Response, Request, Form
from twilio.twiml.voice_response import VoiceResponse, Gather

# 1. Setup Logging to see the results in your terminal
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CHANGE THIS to your current ngrok URL (no trailing slash)
BASE_URL = "https://your-ngrok-id.ngrok-free.app"

def twiml_response(vr: VoiceResponse):
    return Response(content=str(vr), media_type="application/xml")

# --- STEP 1: NITROGEN (Keypad) ---
@app.post("/voice")
async def ask_n():
    vr = VoiceResponse()
    # Using 'dtmf' for keypad input
    gather = Gather(input='dtmf', action=f'{BASE_URL}/process-n', timeout=5, num_digits=3)
    gather.say("Welcome. Enter the Nitrogen value on your dial pad, then press hash.")
    vr.append(gather)
    return twiml_response(vr)

# --- STEP 2: PHOSPHORUS (Keypad) ---
@app.post("/process-n")
async def process_n(Digits: str = Form(None)):
    vr = VoiceResponse()
    logger.info(f"Nitrogen received: {Digits}")
    
    gather = Gather(input='dtmf', action=f'{BASE_URL}/process-p', timeout=5, num_digits=3)
    gather.say(f"Nitrogen {Digits} recorded. Now enter the Phosphorus value on your keypad.")
    vr.append(gather)
    return twiml_response(vr)

# --- STEP 3: POTASSIUM (Keypad) ---
@app.post("/process-p")
async def process_p(Digits: str = Form(None)):
    vr = VoiceResponse()
    logger.info(f"Phosphorus received: {Digits}")
    
    gather = Gather(input='dtmf', action=f'{BASE_URL}/process-k', timeout=5, num_digits=3)
    gather.say(f"Phosphorus {Digits} recorded. Please enter the Potassium value.")
    vr.append(gather)
    return twiml_response(vr)

# --- STEP 4: pH (Keypad) ---
@app.post("/process-k")
async def process_k(Digits: str = Form(None)):
    vr = VoiceResponse()
    logger.info(f"Potassium received: {Digits}")
    
    gather = Gather(input='dtmf', action=f'{BASE_URL}/process-ph', timeout=5, num_digits=2)
    gather.say(f"Potassium {Digits} recorded. Enter your two-digit p H value.")
    vr.append(gather)
    return twiml_response(vr)

# --- STEP 5: LOCATION (Voice) ---
@app.post("/process-ph")
async def process_ph(Digits: str = Form(None)):
    vr = VoiceResponse()
    logger.info(f"pH received: {Digits}")
    
    # SWITCHING TO VOICE: input='speech'
    gather = Gather(input='speech', action=f'{BASE_URL}/final-summary', timeout=4, speech_timeout='auto')
    gather.say(f"p H {Digits} recorded. Finally, please speak the name of your city or location.")
    vr.append(gather)
    return twiml_response(vr)

# --- STEP 6: FINAL SUMMARY ---
@app.post("/final-summary")
async def final_summary(SpeechResult: str = Form(None)):
    vr = VoiceResponse()
    logger.info(f"Location Spoken: {SpeechResult}")
    
    if SpeechResult:
        vr.say(f"Thank you. Your location, {SpeechResult}, has been saved. Goodbye.")
    else:
        vr.say("I didn't catch the location, but your other values are saved. Goodbye.")
        
    vr.hangup()
    return twiml_response(vr)