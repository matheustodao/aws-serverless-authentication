import { CustomMessageTriggerEvent } from 'aws-lambda';

export async function handler(event: CustomMessageTriggerEvent) {
  const name = event.request.userAttributes.given_name;
  const email = event.request.userAttributes.email;
  const code = event.request.codeParameter;

  if (event.triggerSource === 'CustomMessage_SignUp') {

    event.response.emailSubject = `Bem-vindo(a) ${name}!`;
    event.response.emailMessage = `<h1>Olá ${name},</h1> <br/><br/><p>Estamos quase terminando, use este código para confirmar a sua conta: <strong>${code}</strong></p>`;
  }

  if (event.triggerSource === 'CustomMessage_ForgotPassword') {
    event.response.emailSubject = 'Recuperação de conta!';
    event.response.emailMessage = `<h1>Para recuperar a sua conta acesse:</h1> https://app.example.com/reset?email=${encodeURIComponent(email)}&code=${code}`;
  }

  return event;
}
