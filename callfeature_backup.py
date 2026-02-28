import logging
from fastapi import FastAPI, Response, Request, Form
from twilio.twiml.voice_response import VoiceResponse, Gather

# 1. Setup Detailed Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI()

# Helper function to ensure Twilio gets valid XML and we see it in the console
def twiml_response(vr: VoiceResponse):
    xml_content = str(vr)
    print("\n--- OUTGOING TWIML TO TWILIO ---")
    print(xml_content)
    print("--------------------------------\n")
    return Response(content=xml_content, media_type="application/xml")

@app.get("/")
def health_check():
    return {"status": "Live", "message": "Twilio Soil Analyzer is running"}

# --- STEP 1: NITROGEN (Keypad) ---
@app.post("/voice")
async def ask_n():
    logger.info(">>> Call Started: Asking for Nitrogen")
    vr = VoiceResponse()
    # finish_on_key='#' allows user to skip the timeout
    gather = Gather(input='dtmf', action='/process-n', timeout=5, num_digits=3, finish_on_key='#')
    gather.say("Welcome. Enter the Nitrogen value on your dial pad, then press hash.")
    vr.append(gather)
    return twiml_response(vr)

# --- STEP 2: PHOSPHORUS (Keypad) ---
@app.post("/process-n")
async def process_n(Digits: str = Form(None)):
    logger.info(f">>> Received Nitrogen: {Digits}")
    vr = VoiceResponse()
    
    if not Digits:
        vr.say("I didn't receive an input for Nitrogen. Please try again.")
        vr.redirect('/voice')
        return twiml_response(vr)

    gather = Gather(input='dtmf', action='/process-p', timeout=5, num_digits=3, finish_on_key='#')
    gather.say(f"Nitrogen {Digits} recorded. Enter the Phosphorus value, then press hash.")
    vr.append(gather)
    return twiml_response(vr)

# --- STEP 3: POTASSIUM (Keypad) ---
@app.post("/process-p")
async def process_p(Digits: str = Form(None)):
    logger.info(f">>> Received Phosphorus: {Digits}")
    vr = VoiceResponse()
    
    gather = Gather(input='dtmf', action='/process-k', timeout=5, num_digits=3, finish_on_key='#')
    gather.say(f"Phosphorus {Digits} recorded. Enter the Potassium value, then press hash.")
    vr.append(gather)
    return twiml_response(vr)

# --- STEP 4: pH (Keypad) ---
@app.post("/process-k")
async def process_k(Digits: str = Form(None)):
    logger.info(f">>> Received Potassium: {Digits}")
    vr = VoiceResponse()
    
    gather = Gather(input='dtmf', action='/process-ph', timeout=5, num_digits=2, finish_on_key='#')
    gather.say(f"Potassium {Digits} recorded. Enter the two digit p H value, then press hash.")
    vr.append(gather)
    return twiml_response(vr)

# --- STEP 5: LOCATION (Speech + # Key) ---
@app.post("/process-ph")
async def process_ph(Digits: str = Form(None)):
    logger.info(f">>> Received pH: {Digits}")
    vr = VoiceResponse()
    
    # Using 'speech dtmf' allows the # key to terminate a voice recording
    gather = Gather(
        input='speech dtmf', 
        action='/final-summary', 
        timeout=5, 
        speech_timeout='auto', 
        finish_on_key='#',
        hints="Mumbai, Delhi, Bangalore, Agriculture, Farm"
    )
    gather.say(f"p H {Digits} recorded. Finally, please speak your city or location name, then press hash.")
    vr.append(gather)
    return twiml_response(vr)

# --- STEP 6: FINAL SUMMARY ---
@app.post("/final-summary")
async def final_summary(SpeechResult: str = Form(None), Digits: str = Form(None)):
    # Log both just in case they typed something during the speech step
    logger.info(f">>> Final Location Speech: {SpeechResult}")
    logger.info(f">>> Final Location Digits: {Digits}")
    
    vr = VoiceResponse()
    if SpeechResult:
        vr.say(f"Thank you. Your location {SpeechResult} has been recorded. All parameters sent. Goodbye.")
    else:
        vr.say("Thank you. Your parameters have been recorded. Goodbye.")
        
    vr.hangup()
    return twiml_response(vr)