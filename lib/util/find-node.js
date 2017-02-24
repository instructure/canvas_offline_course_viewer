export default function findNode (structure, path) {
  let node = structure
  path.forEach((nodeIndex) => {
    node = node.files[nodeIndex]
  })
  return node
}
