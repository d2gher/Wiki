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
  document.querySelector('#email-view').style.display = 'none';

  // Show the mailbox name
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(results => {
    results.forEach(email => {
      const element = document.createElement("div");
      element.className = "Card"
      
      element.innerHTML = 
        `
          <div class="card-body">
            <h5 class="card-title">${email.subject}</h5>
            <h6 class="card-subtitle mb-2 text-muted">From: ${email.sender}</h6>
            <h6 class="card-subtitle mb-2 text-muted">Time: ${email.timestamp}</h6>
          </div>
        `
        element.style.backgroundColor = email.read? "#ebebeb" : "White";
        element.addEventListener("click", () => email_view(email.id));
      document.querySelector("#emails-view").append(element);
    });
  }).catch(err => console.log(err))
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

function email_view(id) {
  document.querySelector('#email-view').style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  const email_box = document.querySelector("#email-view");

  fetch(`/emails/${id}`)
  .then(res => res.json())
  .then(email => {
    console.log(email)
    email_box.innerHTML = 
    `
    <div class="card">
      <h5 class="card-header">${email.subject}</h5>
      <div class="card-body">
        <h6 class="card-title">From: ${email.sender}</h6>
        <h6 class="card-title">To: ${email.recipients}</h6>
        <h6 class="card-title">At: ${email.timestamp}</h6>
        <p class="card-text">${email.body}</p>
        <a href="#" class="btn btn-primary">Replay</a>
      </div>
    </div>
    `
    fetch(`/emails/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        read: true
      })
    }).catch(err => console.log(err))
  })

}

