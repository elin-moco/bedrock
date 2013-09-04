from django.forms import Form, EmailField
from bedrock.mozorg.forms import EmailInput


class NewsletterForm(Form):
    email = EmailField(widget=EmailInput(attrs={'required': 'required'}))

