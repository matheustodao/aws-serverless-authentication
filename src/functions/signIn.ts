import { bodyParser } from '@/utils/bodyParser';
import { response } from '@/utils/response';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { InitiateAuthCommand, NotAuthorizedException, UserNotConfirmedException, UserNotFoundException } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '@/libs/cognitoClient';

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const { email, password } = bodyParser(event.body);
    const command = new InitiateAuthCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      }
    });

    const { AuthenticationResult } = await cognitoClient.send(command);

    if (!AuthenticationResult) {
      return response(401, { error: 'Invalid credentials' });
    }

    return response(200, {
      accessToken: AuthenticationResult.AccessToken,
      refreshToken: AuthenticationResult.RefreshToken,
    });
  } catch (error) {
    if (error instanceof UserNotFoundException || error instanceof NotAuthorizedException) {
      return response(401, {
        error: 'Invalid credentials'
      });
    }

    if (error instanceof UserNotConfirmedException) {
      return response(401, {
        error: 'You need confirm your account before sign in'
      });
    }

    return response(500, {
      error: 'Internal server error'
    });
  }
}
