//Definicion de variables
const url = 'https://jsonplaceholder.typicode.com/posts'
const contenedor = document.querySelector('tbody')
let resultados = ''

const modalPost = new bootstrap.Modal(document.getElementById('modalPost'))
const formPost = document.querySelector('form')
const idUsuario = document.getElementById('iduser')
const titulo = document.getElementById('titulo')
const descripcion = document.getElementById('description')
let opcion = ''

botonCrear.addEventListener('click', ()=>{
    idUsuario.value = ''
    titulo.value = ''
    descripcion.value = ''
    modalPost.show()
    opcion = 'crear'
})

//Funcion para mostrar
const mostrar = (posts) => {
    posts.forEach(post => {
    resultados += `
                  <tr>
                      <td>${post.id}</td>
                      <td>${post.userId}</td>
                      <td>${post.title}</td>
                      <td>${post.body}</td>
                      <td>
                      <a class="botonEditar btn btn-primary">Editar</a><br><br>
                      <a class="botonBorrar btn btn-danger">Borrar</a>
                      </td>
                  </tr>
                  `
    })
    contenedor.innerHTML = resultados
}

//Procedimiento Mostrar
fetch(url)
.then( response => response.json() )
.then( data => mostrar(data) )
.catch( error => console.log(error) )

const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
             handler(e)
        }
    })
}

//Procedimiento Borrar
on(document, 'click', '.botonBorrar', e => {
    const fila = e.target.parentNode.parentNode
    const id = fila.firstElementChild.innerHTML

    alertify.confirm("Confirmar...",
     function(){
      fetch(url+id, {
         method: 'DELETE'
      });
        alertify.success('Ok')
     },
     function(){
        alertify.error('Cancelado')
     })
});

//Procedimiento Editar
let userIdFormulario = 0
let idFormulario = 0
on(document, 'click', '.botonEditar', e => {
    const fila = e.target.parentNode.parentNode
    userIdFormulario = fila.children[0].innerHTML
    idFormulario = fila.children[1].innerHTML
    const titleFormulario = fila.children[2].innerHTML
    const descripcionFormulario = fila.children[3].innerHTML
    
    idUsuario.value = userIdFormulario
    titulo.value = titleFormulario
    descripcion.value = descripcionFormulario
    opcion = 'editar'
    modalPost.show()
})

//Procedimiento Crear y Editar
formPost.addEventListener('submit', (e)=>{
    e.preventDefault()
    if (opcion=='crear') {
        fetch(url,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                title:titulo.value,
                body:descripcion.value,
                userId:idUsuario.value
            })
        })
        .then( response => response.json() )
        .then( data => {
             const nuevoPost = []
             nuevoPost.push(data)
             mostrar(nuevoPost)
        })

    }
    if (opcion=='editar') {
        fetch(url+idFormulario, {
           method:'PUT',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                title:titulo.value,
                body:descripcion.value,
                userId:idUsuario.value
            }) 
        })
        .then( response => response.json() )
        .then( response => location.reload())
    }
    modalPost.hide()
})
