'use strict'

export default function graft(branches, root = null, position) {
   const fragment = new DocumentFragment()
}

export default function createComponent(tree, root = null, position = 'beforeend') {

   if (tree?.constructor.name !== 'Object')
   {
      console.error(tree)
      throw TypeError(`The first argument of createComponent must be an Object instead of the above ${tree?.constructor.name ?? tree}.`)
   }

   if (!root instanceof HTMLElement && root !== null)
   {
      console.error(root)
      throw TypeError(`The second argument of createComponent must be an HTMLElement or null instead of the above ${root?.constructor.name ?? root}`)
   }

   if (typeof tree.tag !== 'string' || tree.tag === '')
   {
      throw TypeError('The first argument of createComponent must have a "tag" property whose value is a non-empty string')
   }

   const element = document.createElement(tree.tag)

   for (const key in tree)
   {
      if (key === 'tag') continue

      if (key === 'children')
      {
         if (tree[key]?.constructor.name !== 'Array')
         {
            console.error(tree[key])
            throw TypeError(`A 'children' property must be an Array instead of the above ${tree[key]?.constructor.name ?? tree[key]}`)
         }

         for (const child of tree[key])
         {
            switch (child?.constructor.name)
            {
               case 'String':
                  element.appendChild(document.createTextNode(child))
                  break
               case 'Object':
                  createComponent(child, element)
                  break
               default:
                  console.error(child)
                  throw TypeError(`A children array must only have strings or objects but a children array has the above ${child?.constructor.name ?? child}`)
            }
         }
      }
      else
      {
         element.setAttribute(key, tree[key])
      }
   }

   if (root)
   {
      root.insertAdjacentElement(position, element)
   }

   return element
}
