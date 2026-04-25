There were two issues with how Vercel handles Express applications as serverless functions:

1. **Missing Express Export:** Vercel requires your main Node.js file to export the Express application instance in order to wrap it into a serverless function. Your `api/server.js` file was only calling `app.listen()` directly. I added `module.exports = app;` to the very bottom of the file to fix this.
2. **Incorrect Vercel Rewrite Configuration:** Your `vercel.json` had a rewrite mapped dynamically catching incoming routes `/(.*)` and directing them to `/api`. In Vercel's routing folder structure syntax, pointing to `/api` looks for an `index.js` file inside the `api` directory! Since your file was named `server.js`, it wasn't resolving. I've updated the destination in `vercel.json` to point specifically to `/api/server`.

Here are the changes that have been made:
```diff
--- vercel.json
+++ vercel.json
@@ -2,3 +2,3 @@
   "version": 2,
-  "rewrites": [{ "source": "/(.*)", "destination": "/api" }],
+  "rewrites": [{ "source": "/(.*)", "destination": "/api/server" }],
   "headers": [
```

```diff
--- api/server.js
+++ api/server.js
@@ -159,3 +159,5 @@
 // App listener
 app.listen(port, () => console.log(`Listening on port ${port}`));
+
+module.exports = app;
```

Commit and push these changes to your Vercel-linked repository and you should see the 404 errors resolve natively on your deployed link: `https://city-explorer-26.vercel.app/location?search=gateway%20arch`. Let me know if you run into any more issues!