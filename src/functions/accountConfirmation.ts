import { bodyParser } from '@/utils/bodyParser';
import { response } from '@/utils/response';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '@/libs/cognitoClient';

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const body = bodyParser(event.body);
    const command = new ConfirmSignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: body.email,
      ConfirmationCode: body.code,
    });

    await cognitoClient.send(command);

    return response(204);
  } catch (error) {
    return response(500, {
      error: 'Internal server error'
    });
  }
}
