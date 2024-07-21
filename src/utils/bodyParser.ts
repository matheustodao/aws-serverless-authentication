type TBody = Record<string, any>

export function bodyParser(body: string | undefined): TBody {
  let parsedBody = { };

  try {
    if (body) {
      parsedBody = JSON.parse(body);
    }
  } catch { }

  return parsedBody;
}
