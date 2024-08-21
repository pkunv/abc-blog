import { env } from "@/env";
import { db } from "@/server/db";

async function main() {
  // find first or create admin user
  const user = await db.user.upsert({
    where: { name: env.ADMIN_USERNAME },
    update: {},
    create: {
      name: env.ADMIN_USERNAME,
    },
  });

  await db.post.create({
    data: {
      title: "About",
      slug: `about-${new Date().getTime().toString().slice(-4)}`,
      placement: "ABOUT",
      contentPreview: "Welcome to ABC Blog!",
      content: `[{"children":[{"text":""}],"type":"img","url":"https://raw.githubusercontent.com/pkunv/abc-blog/main/public/favicon.ico","width":126,"id":"kbu03","caption":[{"text":"Simple as it gets."}]},{"children":[{"text":"Welcome to ABC Blog! "}],"type":"h1"},{"children":[{"text":"With this simple web app, you can create your own blog that is optimized for search engines and provides rich text content editing."}],"type":"p","id":"zt8l4"},{"children":[{"text":"All you need is a Postgres database, which you can get for free with providers like NeonDB or Vercel."}],"type":"p","id":"q9c91"},{"children":[{"text":"If you are an admin of your blog or interested in deploying your own instance, check out "},{"children":[{"text":"https://github.com/pkunv/abc-blog"}],"type":"a","url":"https://github.com/pkunv/abc-blog","id":"c11ll"},{"text":" for more information."}],"type":"p","id":"3u4st"},{"children":[{"text":""}],"type":"p","id":"f81iw"},{"children":[{"text":"NOTE: This is an early version. Many features are in the process of development."}],"type":"blockquote","id":"ddfn5"},{"children":[{"text":"Created by Kunv"}],"type":"h3","id":"8e91c"},{"children":[{"text":""}],"type":"p","id":"jp73t"},{"children":[{"text":""}],"type":"p","id":"qofxt"}]`,
      keywords:
        "about,abc-blog,blog,search engine optimization,rich text content editing,postgres,neondb,vercel,github",
      category: "About",
      createdById: user.id,
    },
  });
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
