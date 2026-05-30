import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export const handler = async (event: { httpMethod: string; body: string | null }) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다.' }),
    };
  }

  let imageBase64: string;
  let mediaType: string;

  try {
    const body = JSON.parse(event.body || '{}');
    imageBase64 = body.imageBase64;
    mediaType = body.mediaType || 'image/jpeg';
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: '잘못된 요청입니다.' }) };
  }

  if (!imageBase64) {
    return { statusCode: 400, body: JSON.stringify({ error: '이미지가 없습니다.' }) };
  }

  const today = new Date().toISOString().split('T')[0];

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
              data: imageBase64,
            },
          },
          {
            type: 'text',
            text: `이 영수증 이미지를 분석해서 아래 JSON 형식으로만 답변하세요. 다른 텍스트는 절대 포함하지 마세요.

{
  "merchant": "상호명 (문자열)",
  "amount": 최종결제금액 (숫자, 원 단위, 쉼표/기호 없이),
  "date": "YYYY-MM-DD 형식 날짜",
  "memo": "특이사항 또는 null"
}

오늘 날짜: ${today}
날짜를 찾을 수 없으면 오늘 날짜를 사용하세요.
금액은 총 결제 금액 기준으로 숫자만 반환하세요.`,
          },
        ],
      },
    ],
  });

  const text = (response.content[0] as { type: string; text: string }).text.trim();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: '영수증을 인식하지 못했습니다.' }),
    };
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed),
    };
  } catch {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: '결과 파싱 실패' }),
    };
  }
};
