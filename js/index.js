let carrito = [];
const api = "https://dummyjson.com/products";
const rowProductos = document.getElementById("productos");
const contenidoCarrito = document.getElementById("contenidoCarrito");
const totalCarrito = document.getElementById('totalCarrito');

const obtenerProductos = async () => {
  const productos = await fetch(api);
  const productosJSON = await productos.json();
  return productosJSON;
};

const obtenerProducto = async (id) => {
  const productos = await fetch(`${api}/${id}`);
  const productosJSON = await productos.json();
  return productosJSON;
};

const listarProductos = async () => {
  const productos = await obtenerProductos();
  productos["products"].forEach((e) => {
    const {
      id,
      title,
      description,
      price,
      discountPercentage,
      stock,
      brand,
      category,
      thumbnail,
      images = [],
    } = e;
    rowProductos.innerHTML += `
    <div class="card" style="height: 24rem; width: 17rem; padding: 0;">
      <div class="card-body">
        <div class="card-header mb-2" style="height: 30%; overflow: hidden;">                  
          <img src="${images[0]}" alt="" class="card-img-top object-fit-cover">
        </div>
        <h5 class="card-title">${title}</h5>
        <p class="card-text">${description}</p>
        <p class="fs-6">Cantidad: ${stock}</p>
        <div class="d-flex justify-content-between px-2">
          <p class="fs-2">$${price}</p>
          <i class="add bi bi-cart4 fs-3 text-warning" id="${id}" onclick="agregarCarrito(${id})"></i>
        </div>
      </div>
    </div>`;
  });
};

const agregarCarrito = async (id) => {
  const producto = await obtenerProducto(id);
  const buscarProducto = carrito.find((e) => e.id === producto.id);
  if (!buscarProducto) {
    carrito.push({
      id: producto.id,
      title: producto.title,
      category: producto.category,
      description: producto.description,
      price: producto.price,
      stock: producto.stock,
      images: producto.images,
      cantidad: 1,
    });
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Producto Agregado',
      showConfirmButton: false,
      timer: 1000
    })
  }else{
    if (buscarProducto.cantidad < buscarProducto.stock) {
      buscarProducto.cantidad ++;
    }
    else{ 
      Swal.fire(
        `El stock de este producto es de ${buscarProducto.stock}`,
      )
    }
  }
};

const borrarProducto = (id) => {
  Swal.fire({
    title: '¿Seguro que quiere borrar este producto del carrito?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, borrar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      carrito = carrito.filter((e) => e.id !== id);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Producto Eliminado!',
        showConfirmButton: false,
        timer: 1500
      })
      mostrarCarrito();
    }
  })
}

const mostrarCarrito = () => {
  let items = ``;
  let total = 0;
  if (!carrito[0]) {
    contenidoCarrito.innerHTML = `<img src="./carroVacio.png" alt="" class="img-fluid">`;
    totalCarrito.innerHTML = `$${total}`;
  } else {
    carrito.forEach(e => {
      total += e.cantidad * e.price;
      items += 
        `<div class="row card align-items-center p-3 my-1" style="height: 14rem;">
          <div class="col-8">
              <strong class="d-inline-block mb-2 text-primary">${e.category}</strong>
              <h4 class="mb-0">${e.title}</h4>
              <div class="mb-1 text-body-secondary">Stock: ${e.stock}</div>
              <p class="card-text mb-auto">${e.description}</p>
              <div class="row justify-content-between align-items-center my-1">
                  <div class="col-6 d-flex">
                      <input type="text" class="form-control text-center" readonly value="${e.cantidad}">
                  </div>
                  <i class="bi bi-trash3 col-6 fs-5" onclick="borrarProducto(${e.id})"></i>
              </div>
          </div>
          <div class="col-4">
            <img src="${e.images[0]}" alt="" class="img-fluid">
          </div>
      </div>`;
    });
    contenidoCarrito.innerHTML = items;
    totalCarrito.innerHTML = `$${total}`;
  }
}

listarProductos();