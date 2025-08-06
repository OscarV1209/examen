// DOM
// Constante del formulario obtenida por el ID
const form = document.getElementById("crud-form");   // formulario
const nombreInput = document.getElementById("name");  // nombre
const edadInput = document.getElementById("age");  // edad
const gradoInput = document.getElementById("grade");  // curso/grade
const seccionInput = document.getElementById("section");  // seccion
const correoInput = document.getElementById("email");  // correo/email
const promedioInput = document.getElementById("average");  // promedio
const tablaAlumno = document.getElementById("table-data-alumno");   // Tabla de registros
const btnCancelar = document.getElementById("cancel");     // boton de cancelar

let idEditando = null;

// event para crear y actualizar 
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = nombreInput.value;
const edad = edadInput.value;
const grado = gradoInput.value;
const seccion = seccionInput.value;
const correo = correoInput.value;
const promedio = promedioInput.value;

    if(idEditando){
        await db.collection('Alumno').doc(idEditando).update({nombre, edad, grado, seccion, correo, promedio});
        idEditando = null;
        form.querySelector('button[type="submit"]').textContent = 'Guardar';
        btnCancelar.style.display = 'none';
    } else{
        await db.collection('Alumno').add({nombre, edad, grado, seccion, correo, promedio});
    }
    form.reset();
});

// funcion para mostrar los datos en la tabla
function mostrarDatos(){
    db.collection('Alumno').onSnapshot((snapshot) => {
        tablaAlumno.innerHTML = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>${data.nombre}</td>
            <td>${data.edad}</td>
            <td>${data.grado}</td>
            <td>${data.seccion}</td>
            <td>${data.correo}</td>
            <td>${data.promedio}</td>
            <td>
             <button style="background-color: blue;" onclick="editarUsuario('${doc.id}', '${data.nombre}', '${data.edad}', '${data.grado}' , '${data.seccion}' , '${data.correo}' , '${data.promedio}' )"><i class="fa-solid fa-edit"></i> Editar</button>
             <button onclick="eliminarUsuario('${doc.id}')"><i class="fa-solid fa-trash"></i> Eliminar</button>
            </td>
            `;
            tablaAlumno.appendChild(tr);  
        });
    });
}

//llamado funcion para mostrar
mostrarDatos();

// Editar usuario
window.editarUsuario = (id, nombre, edad, grado, seccion, correo, promedio) => {
    idEditando = id;
    nombreInput.value = nombre;
    edadInput.value = edad;
    gradoInput.value = grado;
    seccionInput.value = seccion;
    correoInput.value = correo;
    promedioInput.value = promedio;
    form.querySelector('button[type="submit"]').textContent = 'Actualizar';
    btnCancelar.style.display = 'inline';
};

btnCancelar.addEventListener('click', () => {
    idEditando = null;
    form.reset();
    form.querySelector('button[type="sumit"]').textContent = 'Guardar';
    btnCancelar.style.display = 'none';
});


// Eliminar usuario
window.eliminarUsuario = async (id) => {
    if(confirm('¿Seguro que deseas eliminar este usuario?')){
        await db.collection('Alumno').doc(id).delete();
    }
};