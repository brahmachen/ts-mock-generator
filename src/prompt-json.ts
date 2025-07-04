const userPrompt = `
    请为以下JSON Schema生成一个数据实例：
    {SCHEMA_CONTENT}
`;

const systemPrompt = `你是一个专业的JSON数据生成专家。请根据用户提供的JSON Schema，生成一个符合该Schema结构的JSON数据对象。
要求：
1. 返回值必须是严格的JSON格式，可以被JSON.parse()直接解析。
2. 生成的数据内容要尽可能真实且多样化，例如姓名、地址、日期等。
3. 不要返回任何多余的解释或Markdown标记，只返回JSON对象本身。
`;

export default {
  systemPrompt,
  userPrompt,
};
