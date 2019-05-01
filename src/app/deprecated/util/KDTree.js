class Node
{
  constructor(element)
  {
    this._element = element;
    this.left = null;
    this.right = null;
  }

  get x()
  {
    return this._element.x;
  }

  get y()
  {
    return this._element.y;
  }

  get element()
  {
    return this._element;
  }
}

class KDTree
{
  constructor()
  {
    this._root = null;
  }

  insert(element)
  {
    const newNode = new Node(element);

    if (!this._root)
    {
      this._root = newNode;
    }
    else
    {
      let depth = 0;
      let node = this._root;
      while(node != null)
      {
        const isLeftChild = depth % 2 == 0 ? newNode.x < node.x : newNode.y < node.y;

        if (isLeftChild)
        {
          if (node.left)
          {
            //Go left...
            node = node.left;
          }
          else
          {
            //Doesn't have a left, so make one...
            node.left = newNode;
            break;
          }
        }
        else
        {
          if (node.right)
          {
            //Go right...
            node = node.right;
          }
          else
          {
            //Doesn't have a right, so make one...
            node.right = newNode;
            break;
          }
        }

        ++depth;
      }
    }
  }

  findNearest(x, y)
  {
    if (!this._root) return null;

    let closest = this._root;
    let minDistSqu = Infinity;
    let depth = 0;

    const stack = [];
    stack.push(closest);

    while(!stack.isEmpty())
    {
      const node = stack.pop();
      const dist = depth % 2 == 0 ? x - node.x : y - node.y;
      const isLeftChild = dist < 0;

      //Go left...
      if (isLeftChild)
      {
        if (node.left)
        {
          stack.push(node.left);
        }
        else
        {
          //At a leaf node...
          const nodeDistSqu = distanceSqu(x, y, node.x, node.y);
          if (nodeDistSqu < minDistSqu)
          {
            closest = node;
            minDistSqu = nodeDistSqu;
          }

          //Should we explore the right subtree?
          if (node.right && dist * dist < minDistSqu)
          {
            stack.push(node.right);
          }
        }
      }
      //Go right...
      else
      {
        if (node.right)
        {
          stack.push(node.right);
        }
        else
        {
          //At a leaf node...
          const nodeDistSqu = distanceSqu(x, y, node.x, node.y);
          if (nodeDistSqu < minDistSqu)
          {
            closest = node;
            minDistSqu = nodeDistSqu;
          }

          //Should we explore the left subtree?
          if (node.left && dist * dist < minDistSqu)
          {
            stack.push(node.left);
          }
        }
      }
      ++depth;
    }

    return closest.element;
  }
}

function distanceSqu(x1, y1, x2, y2)
{
  const dx = x2 - x1;
  const dy = y2 - y1;
  return dx * dx + dy * dy;
}

export default KDTree;
