import { bodyParser } from '@/utils/bodyParser';
import { response } from '@/utils/response';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { SignUpCommand, UsernameExistsException } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '@/libs/cognitoClient';

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const body = bodyParser(event.body);
    const command = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: body.email,
      Password: body.password,
      UserAttributes: [
        { Name: 'given_name', Value: body.given_name }
      ]
    });

    const { UserSub } = await cognitoClient.send(command);

    return response(201, {
      id: UserSub,
    });
  } catch (error) {
    if (error instanceof UsernameExistsException) {
      return response(401, {
        error: 'This email already in use'
      });
    }

    return response(500, {
      error: 'Internal server error'
    });
  }
}
