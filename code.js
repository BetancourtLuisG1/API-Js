//Definicion de variables
const url = 'https://jsonplaceholder.typicode.com/posts'
const contenedor = document.querySelector('tbody')
let resultados = ''

const modalArticulo = new bootstrap.Modal(document.getElementById('modalArticulo'))
const formArticulo = document.querySelector('form')
const idUsuario = document.getElementById('iduser')
const titulo = document.getElementById('titulo')
const descripcion = document.getElementById('description')
let opcion = ''

botonCrear.addEventListener('click', ()=>{
    idUsuario.value = ''
    titulo.value = ''
    descripcion.value = ''
	modalArticulo.show()
	opcion = 'crear'
})

//Funcion para mostrar
const mostrar = (articulos) => {
	articulos.forEach(articulo => {
	resultados += `
                  <tr>
                      <td>${articulo.userId}</td>
                      <td>${articulo.id}</td>
                      <td>${articulo.title}</td>
                      <td>${articulo.body}</td>
                      <td>
                      <a class="botonEditar btn btn-primary">Editar</a>
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
	modalArticulo.show()
});

//Procedimiento Crear y Editar
formArticulo.addEventListener('submit', (e)=>{
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
             const nuevoArticulo = []
             nuevoArticulo.push(data)
             mostrar(nuevoArticulo)
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
    modalArticulo.hide()
})