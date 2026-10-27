const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navigation');
function closeMenu(){menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Open menu');nav?.classList.remove('open');}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close menu':'Open menu');nav.classList.toggle('open',open);});
nav?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(menu?.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}}});
document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu();});
const desktop=matchMedia('(min-width:701px)');desktop.addEventListener('change',e=>{if(e.matches)closeMenu();});
const dialog=document.querySelector('.lightbox');
let previousPhotoButton;
document.querySelectorAll('.gallery-open').forEach(button=>button.addEventListener('click',()=>{const source=button.querySelector('img');dialog.querySelector('img').src=source.src;dialog.querySelector('img').alt=source.alt;dialog.querySelector('p').textContent=button.dataset.caption;previousPhotoButton=button;dialog.showModal();}));
dialog?.querySelector('.lightbox-close')?.addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog?.addEventListener('close',()=>previousPhotoButton?.focus());
const form=document.querySelector('#visit-form');
if(form){
 const date=form.elements.date;const now=new Date();const localDate=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');date.min=localDate;
 const selected=new URLSearchParams(location.search).get('programme');const allowed=['playgroup','nursery','kindergarten','daycare'];if(allowed.includes(selected))form.elements.programme.value=selected;
 const review=document.querySelector('#enquiry-review');
 date.addEventListener('input',()=>date.setCustomValidity(''));
 form.addEventListener('submit',event=>{
  event.preventDefault();
  if(date.value&&date.value<localDate){date.setCustomValidity('Please choose today or a future date.');date.reportValidity();return;}
  const data=new FormData(form);const name=String(data.get('name')).trim();if(!name){form.elements.name.setCustomValidity('Please enter your name.');form.elements.name.reportValidity();return;}
  const p=form.elements.programme.options[form.elements.programme.selectedIndex].text;const preferred=date.value?new Date(date.value+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}):'Flexible';
  const message=`Hello Jade! I’d like to arrange a school visit.\n\nParent/guardian: ${name}\nChild’s age: ${data.get('age')}\nProgramme: ${p}\nPreferred visit date: ${preferred}${String(data.get('message')).trim()?'\n\n'+String(data.get('message')).trim():''}\n\nPlease let me know your availability, current fees and next steps. Thank you!`;
  document.querySelector('#message-preview').textContent=message;document.querySelector('#whatsapp-link').href='https://wa.me/94773954321?text='+encodeURIComponent(message);form.hidden=true;review.hidden=false;review.focus();
 });
 form.elements.name.addEventListener('input',()=>form.elements.name.setCustomValidity(''));
 document.querySelector('.edit-enquiry').addEventListener('click',()=>{review.hidden=true;form.hidden=false;form.elements.name.focus();});
}
