if (blocks[index + 1] !== undefined) {
    if (block.hash !== blocks[index + 1].prevHash) {
      return false;
    }
  }