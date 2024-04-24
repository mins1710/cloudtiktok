const Imap = require('node-imap');
const { simpleParser } = require('mailparser');

async function fetchOutlookEmails(username, password) {
  const imap = new Imap({
    user: username,
    password: password,
    host: 'outlook.office365.com',
    port: 993,
    tls: true
  });

  return new Promise((resolve, reject) => {
    const emails = [];

    function openInbox() {
      return new Promise((resolve, reject) => {
        imap.openBox('INBOX', true, (err, box) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    imap.once('ready', async function() {
      try {
        await openInbox();

        const searchResults = await new Promise((resolve, reject) => {
          imap.search(['ALL'], (err, results) => {
            if (err) reject(err);
            else resolve(results);
          });
        });

        const fetchPromises = searchResults.map(seqno => {
          return new Promise((resolve, reject) => {
            const f = imap.fetch(seqno, { bodies: '' });
            f.on('message', function(msg, seqno) {
              const email = {};

              msg.on('body', function(stream, info) {
                simpleParser(stream, {}, (err, parsed) => {
                  if (err) reject(err);

                  email.subject = parsed.subject;
                  email.from = parsed.from.value[0].address;
                  email.html_body = parsed.html;
                  emails.push(email);
                });
              });

              msg.once('end', function() {
                resolve();
              });
            });

            f.once('error', function(err) {
              reject(err);
            });
          });
        });

        await Promise.all(fetchPromises);
        imap.end();
        resolve(emails);
      } catch (error) {
        reject(error);
      }
    });

    imap.once('error', function(err) {
      reject(err);
    });

    imap.connect();
  });
}

module.exports = {fetchOutlookEmails};
