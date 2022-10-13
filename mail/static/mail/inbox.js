document.addEventListener('DOMContentLoaded', function() {
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(results => {
    results.forEach(email => {
      const element = document.createElement("div");
      element.innerHTML = `<p> From: ${email.sender}<br> Subject: ${email.subject}<br> Time:${email.timestamp}`
      document.querySelector("#emails-view").append(element)
    });
  })
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

}

const compose_form = document.querySelector('#compose-form');

compose_form.addEventListener('submit', function(event) {
  event.preventDefault();

  const formData = new FormData(this);

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: formData.get('recipients'),
      subject: formData.get('subject'),
      body: formData.get('body')
    })
  })
  .then(response => response.json())
  .then(results => {
    console.log(results)
  })
  .catch(function(error) { console.error(error) } )
});

