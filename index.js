/* ─── LÓGICA DE CONTROL INTERACTIVA DEL MENÚ ────────────────────
   PROYECTO: Taquería González
   AESTHETICS: Modern Dynamic Web Elements
   VERSION: 10/10 Masterpiece
────────────────────────────────────────────────────────────── */

// Teléfono oficial de WhatsApp de la Taquería González (Empieza con 797)
const TELEFONO_WHATSAPP = '7971185924';

// Datos de productos reales del volante impreso
const tacosData = [
    { id: 'taco_longaniza', nombre: 'Longaniza', precio: 18, desc: 'Lnganiza fresca dorada a la plancha.' },
    { id: 'taco_suadero', nombre: 'Suadero', precio: 18, desc: "Suadero jugoso, suave y tradicional.' },
    { id: 'taco_bistec', nombre: 'Bistec', precio: 18, desc: 'Finos filetes de bistec de res cocinados al momento.' },
    { id: 'taco_mixiote_p', nombre: 'Mixiote de Pollo c/Nopales', precio: 18, desc: 'Pollo preparado en forma de mixiote, con nopales.' },
    { id: 'taco_sesos', nombre: 'Sesos', precio: 18, desc: 'Sesos de res preparadas .' },
    { id: 'taco_cabeza', nombre: 'Cabeza de Puerco', precio: 18, desc: 'Carne jugosa y suave cocida al vapor.' },
    { id: 'taco_enchilada', nombre: 'Carne Enchilada', precio: 18, desc: 'Carne de cerdo enchila estilo jalisco.' },
    { id: 'taco_mixiote_r', nombre: 'Mixiote de Res', precio: 18, desc: 'Carne de res preparada en forma de mixiote tradicional.' },
    { id: 'taco_campechano', nombre: 'Campechanos', precio: 18, desc: 'Fusión de longaniza y bisteck tierno.' },
    { id: 'taco_molleja', nombre: 'Molleja Enchiltipinada', precio: 18, desc: 'Mollejas sazonadas en picante tipo chiltepín.' }
];

const bebidasData = [
    { id: 'refresco', nombre: 'Refresco', precio: 30, desc: 'Bien frío (Coca-Cola, Boing, Sabores)' },
    { id: 'agua_fresca', nombre: 'Aguas Frescas', precio: 30, desc: 'Horchata, Jamaica o sabor natural del día' },
    { id: 'copa_agua', nombre: 'Copa de Agua', precio: 40, desc: 'Agua natural purificada servida con hielo' }
];

// Estado del carrito de compras
let shoppingCart = {};
let lastCartQty = 0;

// Inicializar el menú inyectando las tarjetas en el DOM
function initMenu() {
    const tacosContainer = document.getElementById('tacosContainer');
    const drinksContainer = document.getElementById('drinksContainer');

    if (!tacosContainer || !drinksContainer) return;

    // Tacos
    tacosData.forEach(t => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.id = `card-${t.id}`;

        // Añadir elemento al hacer clic general en la tarjeta (excepto en selectores de cantidad)
        card.addEventListener('click', (e) => {
            if (e.target.closest('.qty-selector')) return;
            addItem(t.id, 'taco');
        });

        card.innerHTML = `
            <div class="item-check">✓</div>
            <div class="item-header">
                <h3 class="item-title">
                    🌮 ${t.nombre}
                    ${t.id === 'taco_suadero' || t.id === 'taco_campechano' ? '<span class="item-badge-popular">Favorito</span>' : ''}
                </h3>
                <p class="item-desc">${t.desc}</p>
            </div>
            <div class="item-footer">
                <span class="item-price">$${t.precio} c/u</span>
                <div class="qty-selector">
                    <button class="qty-btn" onclick="removeItem('${t.id}', event)" aria-label="Quitar uno">−</button>
                    <span class="qty-display" id="display-${t.id}">0</span>
                    <button class="qty-btn" onclick="addItem('${t.id}', 'taco', event)" aria-label="Agregar uno">+</button>
                </div>
            </div>
        `;
        tacosContainer.appendChild(card);
    });

    // Bebidas
    bebidasData.forEach(b => {
        const card = document.createElement('div');
        card.className = 'item-card drink-card';
        card.id = `card-${b.id}`;

        card.addEventListener('click', (e) => {
            if (e.target.closest('.qty-selector')) return;
            addItem(b.id, 'bebida');
        });

        card.innerHTML = `
            <div class="item-check" style="background: var(--verde-bebida)">✓</div>
            <div class="item-header">
                <h3 class="item-title">🥤 ${b.nombre}</h3>
                <p class="item-desc">${b.desc}</p>
            </div>
            <div class="item-footer">
                <span class="item-price">$${b.precio} c/u</span>
                <div class="qty-selector">
                    <button class="qty-btn" onclick="removeItem('${b.id}', event)" aria-label="Quitar uno">−</button>
                    <span class="qty-display" id="display-${b.id}">0</span>
                    <button class="qty-btn" onclick="addItem('${b.id}', 'bebida', event)" aria-label="Agregar uno">+</button>
                </div>
            </div>
        `;
        drinksContainer.appendChild(card);
    });
}

// Alternar pestañas del menú
function switchTab(tab) {
    const btnTacos = document.getElementById('btn-tacos');
    const btnBebidas = document.getElementById('btn-bebidas');
    const tabTacos = document.getElementById('tab-tacos');
    const tabBebidas = document.getElementById('tab-bebidas');

    if (!btnTacos || !btnBebidas || !tabTacos || !tabBebidas) return;

    btnTacos.classList.remove('active');
    btnBebidas.classList.remove('active');
    tabTacos.classList.remove('active');
    tabBebidas.classList.remove('active');

    if (tab === 'tacos') {
        btnTacos.classList.add('active');
        tabTacos.classList.add('active');
    } else {
        btnBebidas.classList.add('active');
        tabBebidas.classList.add('active');
    }
}

// Operaciones del Carrito
function addItem(id, type, event) {
    if (event) event.stopPropagation();
    
    if (!shoppingCart[id]) {
        let dbItem = type === 'taco'
            ? tacosData.find(item => item.id === id)
            : bebidasData.find(item => item.id === id);

        shoppingCart[id] = { ...dbItem, qty: 0, type: type };
    }

    shoppingCart[id].qty++;
    showToast(`+1 ${shoppingCart[id].nombre} en tu pedido`);
    syncElement(id);
    updateCartPanel();
}

function removeItem(id, event) {
    if (event) event.stopPropagation();
    if (!shoppingCart[id]) return;

    shoppingCart[id].qty--;
    if (shoppingCart[id].qty <= 0) {
        showToast(`Quitado de tu pedido: ${shoppingCart[id].nombre}`);
        delete shoppingCart[id];
    } else {
        showToast(`-1 ${shoppingCart[id].nombre}`);
    }

    syncElement(id);
    updateCartPanel();
}

// Sincronizar el conteo de la tarjeta con el estado
function syncElement(id) {
    const qty = shoppingCart[id]?.qty || 0;
    const display = document.getElementById(`display-${id}`);
    const card = document.getElementById(`card-${id}`);

    if (display) display.textContent = qty;
    if (card) {
        if (qty > 0) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    }
}

// Actualizar la interfaz del Carrito de Compras
function updateCartPanel() {
    const container = document.getElementById('cartItemsContainer');
    const emptyMsg = document.getElementById('cartEmptyMessage');
    const totalDisplay = document.getElementById('cartTotalVal');
    const submitBtn = document.getElementById('cartSubmitBtn');
    const badge = document.getElementById('cartCountBadge');
    const clearBtn = document.getElementById('cartClearBtn');

    if (!container || !emptyMsg || !totalDisplay || !submitBtn || !badge) return;

    const items = Object.values(shoppingCart);
    const totalQty = items.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = items.reduce((acc, item) => acc + (item.qty * item.precio), 0);

    badge.textContent = totalQty;
    if (totalQty > 0) {
        badge.classList.add('visible');
        emptyMsg.style.display = 'none';
        submitBtn.disabled = false;
        if (clearBtn) clearBtn.style.display = 'flex';
    } else {
        badge.classList.remove('visible');
        emptyMsg.style.display = 'block';
        submitBtn.disabled = true;
        if (clearBtn) clearBtn.style.display = 'none';
    }

    // Animación de rebote (Wiggle) en el botón flotante al incrementar cantidad
    if (totalQty > lastCartQty) {
        const floatBtn = document.getElementById('floatingCartBtn');
        if (floatBtn) {
            floatBtn.classList.remove('wiggle-animation');
            void floatBtn.offsetWidth; // Disparar reflujo del DOM
            floatBtn.classList.add('wiggle-animation');
        }
    }
    lastCartQty = totalQty;

    // Generar las filas del carrito
    container.innerHTML = '';
    items.forEach(item => {
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
            <div class="cart-item-details">
                <div class="cart-item-name">${item.type === 'taco' ? '🌮' : '🥤'} ${item.nombre}</div>
                <div class="cart-item-price">$${item.precio} c/u</div>
            </div>
            <div class="cart-item-actions">
                <button class="qty-btn" onclick="removeItem('${item.id}', event)">−</button>
                <span class="qty-display">${item.qty}</span>
                <button class="qty-btn" onclick="addItem('${item.id}', '${item.type}', event)">+</button>
            </div>
            <div class="cart-item-total">$${item.qty * item.precio}</div>
        `;
        container.appendChild(row);
    });

    totalDisplay.textContent = `$${totalPrice}.00`;
}

// Vaciar por completo el carrito de compras
function clearCart() {
    const items = Object.keys(shoppingCart);
    if (items.length === 0) return;

    if (confirm('¿Estás seguro de que deseas vaciar por completo tu pedido? 🌮')) {
        items.forEach(id => {
            shoppingCart[id].qty = 0;
            syncElement(id);
        });

        shoppingCart = {};
        showToast('Pedido vaciado por completo');
        updateCartPanel();
        closeCart();
    }
}

// Envío estructurado del pedido a WhatsApp
function sendOrderToWhatsApp() {
    const items = Object.values(shoppingCart);
    if (items.length === 0) return;

    // Obtener y validar la dirección de entrega obligatoria
    const addressInput = document.getElementById('cartAddress');
    const address = addressInput ? addressInput.value.trim() : '';

    if (!address) {
        showToast('⚠️ Por favor, ingresa tu dirección de entrega');
        if (addressInput) {
            addressInput.focus();
            addressInput.style.borderColor = 'var(--rojo-logo)';
            addressInput.style.boxShadow = '0 0 0 4px rgba(168, 44, 34, 0.15)';
            setTimeout(() => {
                addressInput.style.borderColor = '';
                addressInput.style.boxShadow = '';
            }, 3000);
        }
        return;
    }

    const tacos = items.filter(item => item.type === 'taco');
    const drinks = items.filter(item => item.type === 'bebida');
    const notes = document.getElementById('cartNotes').value.trim();
    const total = items.reduce((acc, item) => acc + (item.qty * item.precio), 0);

    let msg = '🌮 *NUEVO PEDIDO - TAQUERÍA GONZÁLEZ* 🌮\n';
    msg += '=================================\n\n';

    if (tacos.length > 0) {
        msg += '🔥 *TACOS:* \n';
        tacos.forEach(t => {
            msg += `• ${t.qty}x Tacos de ${t.nombre} ($${t.precio * t.qty})\n`;
        });
        msg += '\n';
    }

    if (drinks.length > 0) {
        msg += '🥤 *BEBIDAS:* \n';
        drinks.forEach(d => {
            msg += `• ${d.qty}x ${d.nombre} ($${d.precio * d.qty})\n`;
        });
        msg += '\n';
    }

    msg += '=================================\n';
    msg += `💰 *TOTAL ESTIMADO A PAGAR: $${total}.00*\n\n`;
    
    msg += `📍 *DIRECCIÓN DE ENTREGA:* \n"${address}"\n\n`;

    if (notes) {
        msg += `📝 *INDICACIONES ESPECIALES:* "${notes}"\n\n`;
    }

    msg += '🙏 _Por favor, confírmenos la recepción de nuestro pedido, disponibilidad y tiempo estimado. ¡Muchas gracias!_';

    window.open(`https://wa.me/52${TELEFONO_WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
}

// Controladores de apertura y cierre del panel lateral
function openCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (sidebar && overlay) {
        sidebar.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (sidebar && overlay) {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Mostrar notificaciones Toast de confirmación
function showToast(msg) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-icon">✓</span> <span>${msg}</span>`;
    container.appendChild(toast);

    // Pequeño timeout para disparar la animación de entrada
    setTimeout(() => toast.classList.add('show'), 30);

    // Remover automáticamente después de 2.2 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 2200);
}

// ═══ CONTROLES Y EFECTOS MÁGICOS DE KNOW MAGIC ══════════════
function openMagicModal(e) {
    if (e) e.preventDefault();
    const modal = document.getElementById('magicModal');
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        
        // Disparar destellos de magia en la posición del click/toque
        const clientX = e ? e.clientX : window.innerWidth / 2;
        const clientY = e ? e.clientY : window.innerHeight / 2;
        triggerMagicSparkles(clientX, clientY);
    }
}

function closeMagicModal(e) {
    if (e) e.stopPropagation();
    const modal = document.getElementById('magicModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

function triggerMagicSparkles(x, y) {
    const emojis = ['✨', '⭐', '🪄', '💫', '🌟', '💖', '💜'];
    const count = 18; // Cantidad de destellos por explosión
    
    for (let i = 0; i < count; i++) {
        const sparkle = document.createElement('span');
        sparkle.className = 'magic-sparkle';
        sparkle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        
        // Posicionar en el punto del cursor (restando offset scroll para compatibilidad con fixed position)
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        
        // Randomizar trayectorias usando variables CSS
        const tx = (Math.random() - 0.5) * 350; // Desplazamiento X (-175px a 175px)
        const ty = (Math.random() - 0.5) * 350; // Desplazamiento Y
        const rot = Math.floor(Math.random() * 360); // Rotación en grados
        const delay = Math.random() * 0.15; // Retraso aleatorio para fluidez
        
        sparkle.style.setProperty('--tx', `${tx}px`);
        sparkle.style.setProperty('--ty', `${ty}px`);
        sparkle.style.setProperty('--rot', `${rot}deg`);
        sparkle.style.animationDelay = `${delay}s`;
        
        document.body.appendChild(sparkle);
        
        // Limpiar elemento del DOM al terminar animación
        setTimeout(() => {
            sparkle.remove();
        }, 1300);
    }
}

// Inicializar la firma de código de la desarrolladora en consola
function logDeveloperSignature() {
    const titleStyle = 'font-family: monospace; font-size: 13px; font-weight: bold; color: #a78bfa; text-shadow: 0 0 6px rgba(167, 139, 250, 0.4);';
    const bodyStyle = 'font-family: sans-serif; font-size: 11px; color: #cbd5e1; line-height: 1.5;';
    
    console.log(
        `%c\n 🪄  K N O W   M A G I C  ·  C O N S O L E   A R T  ✨\n` +
        `%c─────────────────────────────────────────────────────\n` +
        `Este sitio web ha sido elaborado con pasión y maestría de desarrollo.\n` +
        `Toda la lógica reactiva, interactiva y de efectos es Vanilla Javascript.\n` +
        `¡Una combinación de arte visual, tradición y software de alto impacto!\n\n` +
        `👩‍💻 Desarrollado por Know Magic.\n` +
        `🚀 Especialistas en soluciones creativas que hacen brillar tu negocio.\n` +
        `─────────────────────────────────────────────────────\n`,
        titleStyle,
        bodyStyle
    );
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    initMenu();
    logDeveloperSignature();
});
