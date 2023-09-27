  const container = document.querySelector("#contenedor");
  const modalBody = document.querySelector(".modal .modal-body");

  const containerShoppingCart = document.querySelector("#carritoContenedor");
  const removeAllProductsCart = document.querySelector("#vaciarCarrito");

  const keepBuy = document.querySelector("#procesarCompra");
  const totalPrice = document.querySelector("#precioTotal");

  const activeFunction = document.querySelector("#activarFuncion");

  const fakeStoreApi = "https://fakestoreapi.com/products";

  //definimos un arreglo para guardar los productos que se agreguen al carrito
  let shoppingCart = [];

  //definimos un arreglo para guardar la lista de productos
  let productList = [];

  //definimos un contador para saber cuantos productos se agregan al carrito
  let counter = 0;
  // definimos un arreglo para guardar la cantidad de productos
  let quantity = [];

  // soticitar y agregar al contenedor
  const fetchProducts = async () => {
    try {
      const response = await fetch(fakeStoreApi);
      if (!response.ok) {
        throw new Error("no se pudo conectar");
      }

      return await response.json();
    } catch (error) {
      console.log(error.message);
    }
  };

  const addProductsContainer = (product) => {
    const { id, title, image, price, description } = product;
    container.innerHTML += `
    <div class="card mt-3" style="width: 18rem;">
    <img class="card-img-top mt-2" src="${image}" alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text" style="font-weight: bold">$ ${price}</p>
        <p class="card-text">• ${description}</p>
        <button class="btn btn-primary" onclick="addProduct(${id})">Comprar producto</button>
      </div>
    </div>
    `;
  };

  const getProducts = async () => {
    const products = await fetchProducts();
    productList = products;
    filterByCategory("all"); // Aplica el filtro de inmediato cuando cargas los productos.
  };

  // agregando productos al carrito

  const addProduct = (id) => {
    const testProductId = shoppingCart.some((item) => item.id === id);

    if (testProductId) {
      Swal.fire({
        title: "Este chunche ya fue seleccionado",
        text: "Por favor seleccione otra cosa",
        icon: "success",
      });
      return;
    }

    shoppingCart.push({
      ...productList.find((item) => item.id === id),
      quantity: 1,
    });

    showShoppingCart();
  };

  // carrito de compras

  const showShoppingCart = () => {
    modalBody.innerHTML = "";

    shoppingCart.forEach((product) => {
      const { title, image, price, id } = product;

      modalBody.innerHTML += `
        <div class="modal-contenedor">
          <div>
            <img class="img-fluid img-carrito" src="${image}"/>
          </div>
          <div>
            <p style="font-weight: bold">${title}</p>
            <p style="font-weight: bold">Precio: R$ ${price}</p>
            <div>
              <button onclick="removeProducts(${id})" class="btn btn-danger">Eliminar produto</button>
            </div>
          </div>
        </div>
      `;
    });

    totalPriceInCart(totalPrice);
    messageEmptyShoppingCart();
    containerShoppingCart.textContent = shoppingCart.length;
    setItemInLocalStorage();
  };

  //quitar productos del carrito

  const removeProducts = (id) => {
    const index = shoppingCart.findIndex((item) => item.id === id);

    if (index !== -1) {
      shoppingCart.splice(index, 1);
      showShoppingCart();
    }
  };

  // vaciar carrito de compras

  removeAllProductsCart.addEventListener("click", () => {
    shoppingCart.length = [];
    showShoppingCart();
  });

  // mensagem carrinho vazio
  const messageEmptyShoppingCart = () => {
    if (shoppingCart.length === 0) {
      modalBody.innerHTML = `
        <p class="text-center text-primary parrafo">No hay nada en el carrito!</p>
      `;
    }
  };

  // continuar comprando

  keepBuy.addEventListener("click", () => {
    if (shoppingCart.length === 0) {
      Swal.fire({
        title: "su carrito está vacío",
        text: "Compre algo para continuar",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } else {
      location.href = "index.html";
      finalOrder();
    }
  });

  // precio total en el carrito
  const totalPriceInCart = (totalPriceCart) => {
    totalPriceCart.innerText = shoppingCart.reduce((acc, prod) => {
      return acc + prod.price;
    }, 0);
  };

  // local storage
  const setItemInLocalStorage = () => {
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
  };
  const categoryFilter = document.querySelector("#categoryFilter");

  categoryFilter.addEventListener("change", function () {
    const selectedCategory = this.value;
    filterByCategory(selectedCategory);
  });

  function filterByCategory(category) {
    if (category === "all") {
      productList.forEach(addProductsContainer); // Si la categoría es 'all', simplemente mostramos todos los productos.
    } else {
      const filteredProducts = productList.filter(
        (product) => product.category === category
      ); // Filtramos productos según la categoría seleccionada.
      container.innerHTML = ""; // Limpiamos el contenedor.
      filteredProducts.forEach(addProductsContainer); // Agregamos los productos filtrados al contenedor.
    }
  }

  const addItemInLocalStorage = () => {
    shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
    setItemInLocalStorage();
    showShoppingCart();
  };

  document.addEventListener("DOMContentLoaded", addItemInLocalStorage);
  getProducts();

                  //ORDENAR POR NOMBRE//
  // Obtén una referencia al botón "Ordenar por Nombre"
  const ordenarProductosButton = document.getElementById("ordenarProductosButton");

  // Agrega un evento de clic al botón "Ordenar por Nombre"
  ordenarProductosButton.addEventListener("click", () => {
    // Llama a la función para ordenar los productos por nombre
    ordenarProductosPorNombre();
  });

  // Función para ordenar los productos por nombre (título)
  const ordenarProductosPorNombre = () => {
    // Copia la lista de productos actual para no modificar la original
    const productosOrdenados = [...productList];

    // Ordena la lista de productos por nombre (título) de forma ascendente
    productosOrdenados.sort((a, b) => {
      const tituloA = a.title.toUpperCase(); // Convertir a mayúsculas para ordenar sin distinguir mayúsculas de minúsculas
      const tituloB = b.title.toUpperCase();
      if (tituloA < tituloB) {
        return -1;
      }
      if (tituloA > tituloB) {
        return 1;
      }
      return 0;
    });

    // Llama a la función para mostrar los productos ordenados en el contenedor principal
    mostrarProductosOrdenados(productosOrdenados);
  };

  // Función para mostrar los productos ordenados en el contenedor principal
  const mostrarProductosOrdenados = (productosOrdenados) => {
    container.innerHTML = ""; // Limpia el contenedor principal

    productosOrdenados.forEach((product) => {
      // Agrega cada producto ordenado al contenedor principal
      addProductsContainer(product);
    });
  };



// Objeto para almacenar productos (simulados)
const products = [
  {
    id: 1,
    name: "Producto 1",
    description: "Descripción del Producto 1",
    price: 19.99,
  },
  {
    id: 2,
    name: "Producto 2",
    description: "Descripción del Producto 2",
    price: 29.99,
  },
  // Agrega más productos según sea necesario
];

// Función para cargar productos en la página
const loadProducts = () => {
  const container = document.querySelector("#contenedor");
  container.innerHTML = "";

  products.forEach((product) => {
    container.innerHTML += `
      <div class="card mt-3" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text" style="font-weight: bold">$ ${product.price}</p>
          <p class="card-text">${product.description}</p>
          <button class="btn btn-primary" onclick="editProduct(${product.id})">Editar</button>
          <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Eliminar</button>
        </div>
      </div>
    `;
  });
};

// Cargar productos cuando se carga la página
document.addEventListener("DOMContentLoaded", loadProducts);

// Función para agregar un nuevo producto
const addProductt = () => {
  const productName = prompt("Ingrese el nombre del nuevo producto:");
  const productDescription = prompt("Ingrese la descripción:");
  const productPrice = parseFloat(prompt("Ingrese el precio:"));

  if (productName && !isNaN(productPrice)) {
    const newProduct = {
      id: products.length + 1,
      name: productName,
      description: productDescription,
      price: productPrice,
    };

    products.push(newProduct);
    loadProducts();
  }
};

// Función para editar un producto existente
const editProduct = (productId) => {
  const productIndex = products.findIndex((product) => product.id === productId);

  if (productIndex !== -1) {
    const updatedName = prompt("Ingrese el nuevo nombre:");
    const updatedDescription = prompt("Ingrese la nueva descripción:");
    const updatedPrice = parseFloat(prompt("Ingrese el nuevo precio:"));

    if (updatedName && !isNaN(updatedPrice)) {
      products[productIndex].name = updatedName;
      products[productIndex].description = updatedDescription;
      products[productIndex].price = updatedPrice;
      loadProducts();
    }
  }
};

// Función para eliminar un producto
const deleteProduct = (productId) => {
  const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este producto?");

  if (confirmDelete) {
    const productIndex = products.findIndex((product) => product.id === productId);

    if (productIndex !== -1) {
      products.splice(productIndex, 1);
      loadProducts();
    }
  }
};


