import smtplib, ssl
from app import credentials
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


port :int= 587  # For starttls
smtp_server :str= "smtp.gmail.com"
sender_email :str= credentials['sender_email']
password :str= credentials['sender_pass'] #input("Type your password and press enter:")

server:smtplib.SMTP

# message = MIMEMultipart("alternative")
# message["Subject"] = f"multipart email test {datetime.datetime.now().ctime()}"
# message["From"] = sender_email
# message["To"] = receiver_email
# message["Bcc"] = f"{receiver_email},1019p1019p1@gmail.com,{sender_email}"

# pt1msg = "Hi, this is the plaintext counterpart."
# pt2msg = """\
# <html>
#   <body>
#     <p><h1>Hi,</h1>
#        This is a test message.
#     </p>
#   </body>
# </html>
# """

# message.attach(MIMEText(pt1msg, "plain"))
# message.attach(MIMEText(pt2msg,"html"))

# file = "static/test_attachment.pdf"
# with open( file=file, mode="rb") as f:
#     attachment=MIMEBase("application", "octet-stream")
#     attachment.set_payload(f.read())
# encoders.encode_base64(attachment)
# attachment.add_header("Content-Disposition","attachment", filename="TAKE THIS PDF.pdf")
# message.attach(attachment)


def login_mail_server():
    context = ssl.create_default_context()
    server = smtplib.SMTP(smtp_server, port)
    server.starttls(context=context)
    server.login(sender_email, password)


def sendVerifLink(to:str, url:str, purpose:str):
    context = ssl.create_default_context()
    server = smtplib.SMTP(smtp_server, port)
    server.starttls(context=context)
    server.login(sender_email, password)
    message = MIMEMultipart("alternative")
    message["From"] = sender_email

    msg = ''

    match purpose:
        case 'reg':
            message["Subject"] = "Verify"
            msg = f"Please click here to verify {url}\n\nThis link is valid for one hour"
        
        case 'pass':
            message["Subject"] = "Password Reset"
            msg = f"Please click here to resete your password - {url}\n\nThis link is valid for one hour"
        
        case _:
            return

    
    message.attach(MIMEText(msg, "plain"))
    server.sendmail(sender_email, to , message.as_string())
