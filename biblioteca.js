const form = document.getElementById("formArchivo");
const listaArchivos = document.getElementById("listaArchivos");
const buscar = document.getElementById("buscar");
const progresoContainer = document.getElementById("progresoContainer");
const progresoBar = document.getElementById("progresoBar");

// Cargar lista de archivos desde PHP
function mostrarArchivos(filtro = "") {
    fetch("upload.php?accion=listar")
    .then(res => res.json())
    .then(data => {
        listaArchivos.innerHTML = "";
        data.filter(a => a.nombre.toLowerCase().includes(filtro.toLowerCase()))
            .forEach((archivo, index) => {
                const div = document.createElement("div");
                div.classList.add("archivo");
                div.innerHTML = `<b>${archivo.nombre}</b> 
                <a href="SV Archivos/${archivo.archivo}" download>📥 Descargar</a>
                <span class="eliminar" onclick="eliminarArchivo('${archivo.archivo}')">🗑️</span>`;
                listaArchivos.appendChild(div);
            });
    });
}

// Subir archivo con barra de progreso
form.addEventListener("submit", function(e){
    e.preventDefault();
    const archivoInput = document.getElementById("archivo").files[0];
    const nombre = document.getElementById("nombreArchivo").value;

    if(!archivoInput) return alert("Selecciona un archivo");

    const formData = new FormData();
    formData.append("accion", "subir");
    formData.append("archivo", archivoInput);
    formData.append("nombreArchivo", nombre);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "upload.php", true);

    progresoContainer.style.display = "block";
    progresoBar.style.width = "0%";

    xhr.upload.addEventListener("progress", function(e){
        if(e.lengthComputable){
            const porcentaje = (e.loaded / e.total) * 100;
            progresoBar.style.width = porcentaje + "%";
        }
    });

    xhr.onload = function(){
        if(xhr.status === 200){
            mostrarArchivos();
            form.reset();
            progresoContainer.style.display = "none";
        } else {
            alert("Error al subir archivo");
        }
    };

    xhr.send(formData);
});

// Eliminar archivo
function eliminarArchivo(nombreArchivo){
    if(confirm("¿Seguro que deseas eliminar este archivo?")){
        fetch("SV Archivos/" + nombreArchivo, { method: "DELETE" })
        .then(() => mostrarArchivos());
    }
}

// Buscar archivos
buscar.addEventListener("input", function(){
    mostrarArchivos(this.value);
});

// Mostrar archivos al cargar
mostrarArchivos();
