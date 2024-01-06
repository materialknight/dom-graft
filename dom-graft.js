'use strict'

export default function graft(branches, root = null, position = 'beforeend') {

   if (!['beforeend', 'afterend', 'beforebegin', 'afterbegin'].includes(position))
   {
      throw TypeError("The 'position' argument of graft must be 1 of: 'beforeend', 'afterend', 'beforebegin' or 'afterbegin'")
   }

   if (branches?.constructor.name === 'Array')
   {
      const fragment = new DocumentFragment()

      for (const branch of branches)
      {
         fragment.append(createBranch(branch))
      }

      if (root)
      {
         switch (position)
         {
            case 'beforeend':
               root.append(fragment)
               break
            case 'afterend':
               root.after(fragment)
               break
            case 'beforebegin':
               root.before(fragment)
               break
            case 'afterbegin':
               root.prepend(fragment)
               break
         }
      }

      return fragment
   }

   return createBranch(branches, root, position)
}

export function createBranch(branch, root = null, position = 'beforeend') {

   if (branch?.constructor.name !== 'Object')
   {
      console.error(branch)
      throw TypeError(`The first argument of createBranch must be an Object instead of the above ${branch?.constructor.name ?? branch}.`)
   }

   if (!root instanceof HTMLElement && root !== null)
   {
      console.error(root)
      throw TypeError(`The second argument of createBranch must be an HTMLElement or null instead of the above ${root?.constructor.name ?? root}`)
   }

   if (typeof branch.tag !== 'string' || branch.tag === '')
   {
      throw TypeError('The first argument of createBranch must have a "tag" property whose value is a non-empty string')
   }

   const element = document.createElement(branch.tag)

   for (const key in branch)
   {
      if (key === 'tag') continue

      if (key === 'children')
      {
         if (branch[key]?.constructor.name !== 'Array')
         {
            console.error(branch[key])
            throw TypeError(`A 'children' property must be an Array instead of the above ${branch[key]?.constructor.name ?? branch[key]}`)
         }

         for (const child of branch[key])
         {
            switch (child?.constructor.name)
            {
               case 'String':
                  element.appendChild(document.createTextNode(child))
                  break
               case 'Object':
                  createBranch(child, element)
                  break
               default:
                  console.error(child)
                  throw TypeError(`A children array must only have strings or objects but a children array has the above ${child?.constructor.name ?? child}`)
            }
         }
      }
      else
      {
         element.setAttribute(key, branch[key])
      }
   }

   if (root)
   {
      root.insertAdjacentElement(position, element)
   }

   return element
}
