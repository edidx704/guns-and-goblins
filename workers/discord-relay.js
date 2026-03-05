export default {
  async fetch(request, env, ctx) {
    // Only accept POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Get the payload from GitHub Actions
    const body = await request.json();
    
    // Forward to Discord
    const discordResponse = await fetch(env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: "Guns & Goblins",
        avatar_url: "https://guns-and-goblins.pages.dev/static/icon.png",
        content: `<@&${env.DISCORD_ROLE_ID}> 📜 New lore content published!`,
        embeds: body.embeds
      })
    });

    if (!discordResponse.ok) {
      const error = await discordResponse.text();
      console.error('Discord error:', error);
      return new Response(`Discord error: ${error}`, { status: 500 });
    }

    return new Response('OK', { status: 200 });
  },
};
