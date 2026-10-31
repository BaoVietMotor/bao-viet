# How to put the site online (free, about 15 minutes)

You don't need to write or change any code. You need an email address and a computer with Chrome or Edge.

You'll make two free accounts: GitHub, which stores the website files, and Cloudflare, which runs the website and its database. When you're done you get a link like `https://bao-viet.yourname.workers.dev` that works for anyone, on any phone or computer, and doesn't expire.

Button names can change a little when these sites update their design. If a button isn't exactly where this says, look for one with a similar name.

## The short version

1. Unzip `baoviet-web.zip`.
2. On github.com: sign up, click "+" then "New repository", name it `bao-viet`, choose Public, and click "Create repository". Click "uploading an existing file", drag in everything from inside the `baoviet-web` folder, then click "Commit changes".
3. On dash.cloudflare.com: sign up, open "Workers & Pages", click "Create application", import from GitHub, pick `bao-viet` and click "Save and Deploy".
4. When Cloudflare asks you to pick a workers.dev subdomain, type `baovietmotor`. Your link becomes `https://bao-viet.baovietmotor.workers.dev`.

That link is the one for your resume. It stays the same when you edit the site later: change a file on GitHub, and Cloudflare updates the same link by itself in a minute or two. If `baovietmotor` is taken, pick something close, like `baovietmotor-vn`.

The detailed steps below cover the same thing, plus the admin password, Google search and fixes.

## 1. Unzip the files (1 minute)

Right-click `baoviet-web.zip`, choose "Extract All", then "Extract". Open the new `baoviet-web` folder. Inside you should see the folders `src`, `static` and `test`, plus files like `build.mjs`, `package.json` and `wrangler.jsonc`.

## 2. Upload the files to GitHub (5 minutes)

1. Go to github.com/signup and make an account. Check your email and confirm it.
2. Click the "+" in the top right corner, then "New repository".
3. For the repository name, type `bao-viet`. Pick "Public" (colleges can then look at the code, and there's nothing secret in it). Leave "Add a README" switched off. Click "Create repository".
4. On the next page, click the small link that says "uploading an existing file".
5. Go back to the open `baoviet-web` folder, press Ctrl+A to select everything inside it, and drag it all into the GitHub page in one go. It's 97 files, under GitHub's limit of 100 per upload.
6. Wait until the file list stops growing, then click the green "Commit changes" button at the bottom.
7. Check the result: the main page of your repository should show `src`, `static`, `test` and `wrangler.jsonc` right there, not inside another folder called `baoviet-web`. If they're inside another folder, see the problems table at the end.

## 3. Put it online with Cloudflare (5 minutes)

1. Go to dash.cloudflare.com/sign-up, make an account and confirm your email.
2. In the menu on the left, click "Workers & Pages" (it might be under "Compute"). Click "Create application".
3. Choose the option to import from GitHub ("Import a repository" or "Continue with GitHub"). Let Cloudflare see your `bao-viet` repository when it asks.
4. Pick `bao-viet` from the list. On the setup screen, the project name has to be `bao-viet`, exactly the same as the repository. Leave the build command empty. The deploy command should already say `npx wrangler deploy`; if it's empty, type that in. Don't change anything else.
5. Click "Save and Deploy" (or just "Deploy"). Wait 1 to 3 minutes. Cloudflare builds the pages and also creates the database for pre-orders by itself.
6. When it finishes, it shows your link, something like `https://bao-viet.yourname.workers.dev`. Open it. That's the website, live on the internet.

## 4. Turn on the admin page (2 minutes)

The admin page is where you see pre-orders and messages. It stays locked until you give it a password.

1. In Cloudflare, open your `bao-viet` Worker, then "Settings", then "Variables and Secrets", then "Add".
2. Set the type to "Secret". Name: `ADMIN_PASSWORD`. Value: a password with at least 12 characters that you don't use anywhere else. Save, then click "Deploy" if it asks.
3. Go to your link with `/admin` on the end and log in.

## 5. Test it (2 minutes)

1. Open your link with `/api/health` on the end. It should show `"ok":true` and `"db":"ok"`.
2. On the site, go to the pre-order page and send a test order with your own name and phone number. Take a few seconds filling it in, because forms sent within 2 seconds are treated as spam and not saved.
3. You should get a code like `BV-7K3QX9`. Open `/admin`, find the order and delete it.
4. Open the site on your phone and play the film.

That's it. Send the link to anyone, or put it in your college applications.

## Optional: get it on Google

Google has to find a new site before it shows up in search. You only do this once.

1. Go to search.google.com/search-console, click "Add property", choose "URL prefix" and paste your site link.
2. Choose the "HTML tag" method. Google shows a line like `<meta name="google-site-verification" content="AbC123...">`. Copy only the part inside the quotes after `content=`.
3. In Cloudflare, go to your Worker, "Settings", "Variables and Secrets", "Add". Type "Secret", name `GOOGLE_SITE_VERIFICATION`, paste the value, save and deploy.
4. Go back to Search Console and click "Verify".
5. In the left menu, open "Sitemaps", type `sitemap.xml` and click "Submit".

It usually takes a few days to a couple of weeks before the site appears in search results. A search for just "bao viet" will keep showing the Bảo Việt insurance group first, because they're a huge company. Searches like "Bảo Việt Motor" or "túi chống ngập xe máy" have a much better chance. Sharing the link yourself (Zalo, Facebook, TikTok) is the fastest way to get people onto it.

## Optional: other things you can do later

To change the price, phone number or email: on GitHub, open `site.config.mjs`, click the pencil icon, change the text, and click "Commit changes". Cloudflare rebuilds the site by itself in a minute or two.

To use your own domain name (like `baovietmotor.com`, which costs money every year): buy it from any domain seller, then in Cloudflare go to your Worker, "Settings", "Domains & Routes", "Add", "Custom domain".

To get an email whenever someone pre-orders: make a free account at resend.com, create an API key, and add three Secrets in Cloudflare: `RESEND_API_KEY` (the key), `NOTIFY_EMAIL` (the email you signed up to Resend with) and `NOTIFY_FROM` (you can skip this one).

## If something goes wrong

| What you see | What to do |
|---|---|
| The build fails and says it can't find `wrangler.jsonc` or `build.mjs` | Your files ended up inside an extra folder on GitHub. In Cloudflare, open the Worker, "Settings", "Build", and set "Root directory" to that folder's name. Then retry the deploy. |
| The build fails and mentions the Worker name | The project name in Cloudflare has to be `bao-viet`. Delete the project and import it again with that name. |
| `/api/health` says `database_not_bound`, or the form says the server isn't available | The database wasn't created automatically. In Cloudflare, go to "Storage & Databases", "D1", "Create", and name it `bao-viet-db`. Copy its Database ID. On GitHub, open `wrangler.jsonc`, click the pencil, and change the database line to `{ "binding": "DB", "database_name": "bao-viet-db", "database_id": "PASTE-THE-ID-HERE" }`. Commit, and Cloudflare redeploys. |
| `/admin` says to set an ADMIN_PASSWORD | The password secret is missing or shorter than 12 characters. Redo step 4. |
| `/admin` says there were too many failed attempts | Ten wrong passwords lock the login for 15 minutes. Wait and try again. |
| A test order gave you a code but it's not in `/admin` | It was sent within 2 seconds of opening the page, so it was treated as a bot. Fill in the form at a normal speed and send it again. |

Cloudflare's free plan allows 100,000 requests a day to the Worker. Images, CSS and JavaScript don't count toward that, only page loads, the film and form submissions, so a site this size won't come close.
