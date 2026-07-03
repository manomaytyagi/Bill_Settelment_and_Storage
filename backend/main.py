import os
from dotenv import load_dotenv
import uuid

from supabase import create_client, Client

from fastapi import FastAPI, HTTPException, status, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
admin_email: str = os.environ.get("ADMIN_EMAIL")
admin_password: str = os.environ.get("ADMIN_PASSWORD")
supabase = create_client(url, key)

@app.get("/health")
def get_health():
    return { "status" : "ok" }


@app.post("/submit")
def submit_form(proof: UploadFile, bill: UploadFile, project: str = Form(...), vendor: str = Form(...), amount: int = Form(...)):
    try:
        proof_bytes = proof.file.read()
        proof_path = f"{uuid.uuid4()}_{proof.filename}"
        response_proof = (
            supabase.storage
            .from_("bills")
            .upload(
                file=proof_bytes,
                path=proof_path,
                file_options={"cache-control": "3600", "upsert": "false"}
            )
        )
        
        bill_bytes = bill.file.read()
        bill_path = f"{uuid.uuid4()}_{bill.filename}"
        response_bill = (
            supabase.storage
            .from_("bills")
            .upload(
                file=bill_bytes,
                path=bill_path,
                file_options={"cache-control": "3600", "upsert": "false"}
            )
        )
        proof_url = supabase.storage.from_("bills").get_public_url(proof_path)
        bill_url = supabase.storage.from_("bills").get_public_url(bill_path)
        
        supabase.table("submissions").insert({
            "payment_proof": proof_url,
            "bill": bill_url,
            "project": project,
            "vendor": vendor,
            "amount": amount
        }).execute()
        
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Submission Failed: {str(e)}") 

@app.post("/admin/login")
def validate_login(email: str = Form(...), password: str = Form(...)):
    if(email == admin_email and password == admin_password):
        return {"status" : "Success"}
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Wrong Passowrd or Email")