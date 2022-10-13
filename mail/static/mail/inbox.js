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
      element.className = "Card"
      
      element.innerHTML = 
        `
        <a href="/emails/${email.id}" class="email-link" style="text-decoration: none">
          <div class="card-body">
            <h5 class="card-title">${email.subject}</h5>
            <h6 class="card-subtitle mb-2 text-muted">From: ${email.sender}</h6>
            <h6 class="card-subtitle mb-2 text-muted">Time: ${email.timestamp}</h6>
          </div>
        </a>
        `
        element.style.backgroundColor = email.read? "#ebebeb" : "White";
      document.querySelector("#emails-view").append(element)
      console.log(email)
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
    load_mailbox('Sent');
  })
  .catch(function(error) { console.error(error) } )
});

