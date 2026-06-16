export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {

    const { buttonUrl } = req.body;

    const owner = 'bizmedia1';
    const repo = 'prechlink-manager';
    const path = 'data.json';

    const token = process.env.GITHUB_TOKEN;

    const fileResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json'
        }
      }
    );

    const fileData = await fileResponse.json();

    const updatedContent = Buffer.from(
      JSON.stringify(
        {
          buttonUrl
        },
        null,
        2
      )
    ).toString('base64');

    const updateResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Update URL to ${buttonUrl}`,
          content: updatedContent,
          sha: fileData.sha
        })
      }
    );

    const result = await updateResponse.json();

    return res.status(200).json({
      success: true,
      result
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      error: err.message
    });

  }
}
