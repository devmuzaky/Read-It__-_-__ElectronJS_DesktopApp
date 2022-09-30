// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All the Node.js APIs are available in this process.
// be executed in the renderer process for that window.
// All the Node.js APIs are available in this process.

// Modules
const {ipcRenderer} = require('electron')
const items = require('./items')

// Dom Nodes
let showModal = document.getElementById('show-modal')
let closeModal = document.getElementById('close-modal')
let modal = document.getElementById('modal')
let addItem = document.getElementById('add-item')
let itemUrl = document.getElementById('url')
let search = document.getElementById('search')

// Filter items with search
search.addEventListener('keyup', e => {
    // Loop items
    Array.from(document.getElementsByClassName(('read-item'))).forEach(item => {
        // Hide items that don't match search value
        let hasMatch = item.innerText.toLowerCase().includes(search.value)
        item.style.display = hasMatch ? 'flex' : 'none'
    })
})

// Navigate item selection with up/down keys
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        items.changeSelection(e.key)
    }
})

// Disable & Enable modal buttons
const toggleModalButtons = () => {
    if (addItem.disabled) {
        addItem.disabled = false
        addItem.style.opacity = 1
        addItem.innerText = 'Add Item'
        closeModal.style.display = 'inline'
    }else {
        addItem.disabled = true
        addItem.style.opacity = 0.5
        addItem.innerText = 'Adding...'
        closeModal.style.display = 'none'
    }
}

// Show modal
showModal.addEventListener('click', () => {
    modal.style.display = 'block'
    itemUrl.focus()
});

// Close modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none'
});

// Add item
addItem.addEventListener('click', e => {
    // Get url
    let url = itemUrl.value
    // Validate url
    if (itemUrl) {
        // Send url to main process
        ipcRenderer.send('new-item', url)
        // Disable buttons
        toggleModalButtons();
        // Hide modal and clear value
        // Close modal
        modal.style.display = 'none'
        // Clear url
        itemUrl.value = ''

    }
})

// Listen for new item from main process
ipcRenderer.on('new-item-success', (e, newItem) => {
    // Add new item to "items" node
    items.addItem(newItem, true)
    // Enable buttons
    toggleModalButtons()

    // Hide modal and clear value
    modal.style.display = 'none'
    itemUrl.value = ''
});

// Listen for keyboard submit
itemUrl.addEventListener('keyup', e => {
    if (e.key === 'Enter') {
        addItem.click()
    }
})

