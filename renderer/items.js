// Dom Nodes
let items = document.getElementById('items')

// Track items in storage
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || []

// Persist items in storage
exports.save = () => {
    // Only if storage isn't empty
    if (this.storage.length) {
        // Save storage
        localStorage.setItem('readit-items', JSON.stringify(this.storage))
    }
}

// Add new Item
exports.addItem = (item, isNew = false) => {
    // Create new DOM element
    let itemNode = document.createElement('div')

    // Assign "read-item" class
    itemNode.setAttribute('class', 'read-item')

    // Add inner html
    itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`

    // Append new node to "items"
    items.appendChild(itemNode)

    // Add item to storage and persist
    if (isNew) {
        this.storage.push(item)
        this.save()
    }
}

// Add items from Storage when app loads
this.storage.forEach(item => {
    this.addItem(item)
})