#!/usr/bin/env node
/**
 * Claude Post Generator
 * Usage: node scripts/new-post.mjs
 *
 * Paste your rough notes when prompted → Claude writes the full post
 * → Saved as a Markdown file ready for Decap CMS or direct commit
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

async function getInput(prompt) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(prompt, answer => { rl.close(); resolve(answer); });
  });
}

async function getMultilineInput(prompt) {
  console.log(prompt);
  console.log('(paste your notes, then press Enter twice to finish)\n');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  let lines = [];
  let emptyCount = 0;
  return new Promise(resolve => {
    rl.on('line', line => {
      if (line === '') {
        emptyCount++;
        if (emptyCount >= 2) { rl.close(); resolve(lines.join('\n')); }
        else lines.push(line);
      } else {
        emptyCount = 0;
        lines.push(line);
      }
    });
  });
}

async function generatePost(notes, topic) {
  console.log('\n✦ Claude is writing your post...\n');

  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: `You are writing a blog post for Varun Vashisht's professional portfolio. Varun is a Senior Program Manager, TPM, and Business Architect with 14+ years in enterprise digital transformation.

Write a polished, insightful blog post based on these rough notes:

TOPIC: ${topic}
NOTES: ${notes}

Requirements:
- Professional but conversational tone — like a smart practitioner sharing hard-won insight
- 500-800 words
- Use ## subheadings to structure the post
- Draw on PMO, enterprise delivery, AI/ML, Agile, or digital transformation themes where relevant
- Be specific and practical — avoid generic advice
- End with a clear takeaway

Return ONLY the post content in this exact format:
TITLE: [compelling title]
DESCRIPTION: [one sentence summary, max 160 chars]
TAGS: [tag1, tag2, tag3]
---
[full post body in Markdown]`
    }]
  });

  const raw = message.content[0].text;
  const titleMatch = raw.match(/TITLE:\s*(.+)/);
  const descMatch = raw.match(/DESCRIPTION:\s*(.+)/);
  const tagsMatch = raw.match(/TAGS:\s*(.+)/);
  const bodyMatch = raw.split('---\n').slice(1).join('---\n');

  const title = titleMatch ? titleMatch[1].trim() : topic;
  const description = descMatch ? descMatch[1].trim() : '';
  const tags = tagsMatch ? tagsMatch[1].split(',').map(t => t.trim()) : [];
  const body = bodyMatch.trim();

  return { title, description, tags, body };
}

async function main() {
  console.log('\n✦ Varun\'s Post Generator — powered by Claude\n');

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY environment variable not set.');
    console.error('Get your key at https://console.anthropic.com');
    process.exit(1);
  }

  const topic = await getInput('What\'s the topic? (one line): ');
  const notes = await getMultilineInput('\nPaste your rough notes:');

  const { title, description, tags, body } = await generatePost(notes, topic);

  const slug = slugify(title);
  const pubDate = formatDate(new Date());
  const filename = `${slug}.md`;
  const outputPath = path.join('src', 'content', 'blog', filename);

  const frontmatter = `---
title: "${title}"
description: "${description}"
pubDate: ${pubDate}
tags: [${tags.map(t => `"${t}"`).join(', ')}]
draft: false
---

`;

  fs.writeFileSync(outputPath, frontmatter + body);

  console.log(`\n✓ Post saved to ${outputPath}`);
  console.log(`\nTitle: ${title}`);
  console.log(`\nNext steps:`);
  console.log(`  1. Review the post: ${outputPath}`);
  console.log(`  2. Add a hero image URL to the frontmatter if you want one`);
  console.log(`  3. git add . && git commit -m "Add post: ${title}" && git push`);
  console.log(`  4. Your post will be live in ~2 minutes after Netlify deploys\n`);
}

main();
