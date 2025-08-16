<?php
$dir = "archivos/"; // Cambiado de "archivos/" a "SV Archivos/"

// Crear la carpeta si no existe
if(!is_dir($dir)) mkdir($dir, 0777, true);

$accion = $_POST['accion'] ?? $_GET['accion'] ?? '';

if($accion === "subir" && isset($_FILES['archivo'])){
    $nombreArchivo = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $_POST['nombreArchivo']);
    $ext = pathinfo($_FILES['archivo']['name'], PATHINFO_EXTENSION);
    $ruta = $dir . $nombreArchivo . "." . $ext;

    if(move_uploaded_file($_FILES['archivo']['tmp_name'], $ruta)){
        echo json_encode(['ok'=>true]);
    } else {
        echo json_encode(['ok'=>false]);
    }
    exit;
}

if($accion === "listar"){
    $archivos = [];
    foreach(scandir($dir) as $archivo){
        if($archivo === "." || $archivo === "..") continue;
        $archivos[] = [
            'nombre' => pathinfo($archivo, PATHINFO_FILENAME),
            'archivo' => $archivo
        ];
    }
    echo json_encode($archivos);
    exit;
}
?>
