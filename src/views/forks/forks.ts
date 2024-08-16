export interface BlockItem {
  blockNumber: number;
  blockHash: string;
  parentBlockHash: string;
  isFinalized: boolean;
  index: number;
}

export const data: Record<string, BlockItem[]> = {
  '22070321': [
    {
      'blockHash': '0x607f1630e7eabcc7226a9e491b235b070b9938c5ed8bac0ed7cbceff6e63637c',
      'parentBlockHash': '0xef05635554a142dd986f9deb36b7291030bfabfa2da979f401b5cf08ad0fdc44',
      'isFinalized': false,
      'index': 0,
      'blockNumber': 22070321,
    },
    {
      'blockHash': '0x56ededcd1877076fd90734f358654661b41452ab444fc8740c9df14a1d76c879',
      'parentBlockHash': '0xef05635554a142dd986f9deb36b7291030bfabfa2da979f401b5cf08ad0fdc44',
      'isFinalized': true,
      'index': 1,
      'blockNumber': 22070321,
    },
    {
      'blockHash': '0x961beafd0ae6d4b48cc900d86a7ba095aa8cb508537e0d8f402e097b00fcd9a0',
      'parentBlockHash': '0xef05635554a142dd986f9deb36b7291030bfabfa2da979f401b5cf08ad0fdc44',
      'isFinalized': false,
      'index': 2,
      'blockNumber': 22070321,
    },
  ],
  '22070322': [
    {
      'blockHash': '0xa817341a36e224f38bd6152497a00fd78ef272d1dfee5c2b9964b93f4e2a0639',
      'parentBlockHash': '0x56ededcd1877076fd90734f358654661b41452ab444fc8740c9df14a1d76c879',
      'isFinalized': true,
      'index': 0,
      'blockNumber': 22070322,
    },
    {
      'blockHash': '0x4e9c50a078d29ee92cec67b3186fce95f419c4a264805b73521a85573b67cc2c',
      'parentBlockHash': '0x56ededcd1877076fd90734f358654661b41452ab444fc8740c9df14a1d76c879',
      'isFinalized': false,
      'index': 1,
      'blockNumber': 22070322,
    },
  ],
  '22070323': [
    {
      'blockHash': '0x7522eb98f6649f1ebf1982be93647ea3e13db5a29024b4c0319ff9b452ec4b68',
      'parentBlockHash': '0xa817341a36e224f38bd6152497a00fd78ef272d1dfee5c2b9964b93f4e2a0639',
      'isFinalized': true,
      'index': 0,
      'blockNumber': 22070323,
    },
  ],
  '22070324': [
    {
      'blockHash': '0x52f34931e30700eb611f10567fc7f4662ea82ebcbe68de4f4a64a227e89e3aeb',
      'parentBlockHash': '0x7522eb98f6649f1ebf1982be93647ea3e13db5a29024b4c0319ff9b452ec4b68',
      'isFinalized': true,
      'index': 0,
      'blockNumber': 22070324,
    },
    {
      'blockHash': '0x82aeda080e6d257afb1a8f43338fd711b0675a7d90d5680e4ba4a270f5f10099',
      'parentBlockHash': '0x7522eb98f6649f1ebf1982be93647ea3e13db5a29024b4c0319ff9b452ec4b68',
      'isFinalized': false,
      'index': 1,
      'blockNumber': 22070324,
    },
  ],
  '22070325': [
    {
      'blockHash': '0xbf5d17d9c28975fc59ea2ff5348fe42d15b61d5e383850c7ba48eaffd58e9a31',
      'parentBlockHash': '0x52f34931e30700eb611f10567fc7f4662ea82ebcbe68de4f4a64a227e89e3aeb',
      'isFinalized': true,
      'index': 0,
      'blockNumber': 22070325,
    },
  ],
  '22070326': [
    {
      'blockHash': '0x1176d7a9914a2489c465b91b9e22b25d1406cef9dcd2dfb33f885a4f74afb449',
      'parentBlockHash': '0xbf5d17d9c28975fc59ea2ff5348fe42d15b61d5e383850c7ba48eaffd58e9a31',
      'isFinalized': true,
      'index': 0,
      'blockNumber': 22070326,
    },
  ],
  '22070327': [
    {
      'blockHash': '0x83d1d8586a3e9471bb015c17b822677c90a696a9d91bb98ce47eb10c3bc8e366',
      'parentBlockHash': '0x1176d7a9914a2489c465b91b9e22b25d1406cef9dcd2dfb33f885a4f74afb449',
      'isFinalized': true,
      'index': 0,
      'blockNumber': 22070327,
    },
  ],
  '22070328': [
    {
      'blockHash': '0xd9f0c3449f57cbd712ee1d0962eab2ad1a86e709096b890d17339e7501152367',
      'parentBlockHash': '0x83d1d8586a3e9471bb015c17b822677c90a696a9d91bb98ce47eb10c3bc8e366',
      'isFinalized': false,
      'index': 0,
      'blockNumber': 22070328,
    },
    {
      'blockHash': '0xc29f4be0c9f883cecc404e5a0f75358132442ce59c2c4fea4cf424829d8c85e5',
      'parentBlockHash': '0x83d1d8586a3e9471bb015c17b822677c90a696a9d91bb98ce47eb10c3bc8e366',
      'isFinalized': true,
      'index': 1,
      'blockNumber': 22070328,
    },
  ],
  '22070329': [
    {
      'blockHash': '0xe61dfc85ef84dfcfabbc668bee072129599b2f58f28dce48dfbc4b5cb675bfc8',
      'parentBlockHash': '0xc29f4be0c9f883cecc404e5a0f75358132442ce59c2c4fea4cf424829d8c85e5',
      'isFinalized': true,
      'index': 0,
      'blockNumber': 22070329,
    },
  ],
  '22070330': [
    {
      'blockHash': '0xc536de9d1bba229210d52d5195c13e87eb3a33e3f082dadf131e02129ab534e5',
      'parentBlockHash': '0xe61dfc85ef84dfcfabbc668bee072129599b2f58f28dce48dfbc4b5cb675bfc8',
      'isFinalized': true,
      'index': 0,
      'blockNumber': 22070330,
    },
  ],
  '22070331': [
    {
      'blockHash': '0xd17e3d9683f8c45c2bab7e528cc7caed513ae03267c49beaef539abcf2e40f83',
      'parentBlockHash': '0xc536de9d1bba229210d52d5195c13e87eb3a33e3f082dadf131e02129ab534e5',
      'isFinalized': true,
      'index': 0,
      'blockNumber': 22070331,
    },
  ],
  '22070332': [
    {
      'blockHash': '0xae3c60a5cf89a630a7f6e8c0d67582d477e458e5cfdce5a00aff88d44ba76ad9',
      'parentBlockHash': '0xd17e3d9683f8c45c2bab7e528cc7caed513ae03267c49beaef539abcf2e40f83',
      'isFinalized': false,
      'index': 0,
      'blockNumber': 22070332,
    },
    {
      'blockHash': '0xeac883280239f17b5f7bc561345ca472d4544d1149b884352fe931cf2946ef37',
      'parentBlockHash': '0xd17e3d9683f8c45c2bab7e528cc7caed513ae03267c49beaef539abcf2e40f83',
      'isFinalized': true,
      'index': 1,
      'blockNumber': 22070332,
    },
  ],
  '22070333': [
    {
      'blockHash': '0x81a7684ff15a8f1161ae864016da8bed82724401812f0a1985a9f9bf2e75d92a',
      'parentBlockHash': '0xeac883280239f17b5f7bc561345ca472d4544d1149b884352fe931cf2946ef37',
      'isFinalized': true,
      'index': 0,
      'blockNumber': 22070333,
    },
  ],
  '22070334': [
    {
      'blockHash': '0x11f74f5f1e702df71405cd5a0ba2888f08b24c8ee6c6a90dc20e8a35decca753',
      'parentBlockHash': '0x81a7684ff15a8f1161ae864016da8bed82724401812f0a1985a9f9bf2e75d92a',
      'isFinalized': false,
      'index': 0,
      'blockNumber': 22070334,
    },
  ],
  '22070335': [
    {
      'blockHash': '0x74f4fed8e90c971456bec02092fea809c27ad5110e6c791acf71fbd8bc938d5e',
      'parentBlockHash': '0x11f74f5f1e702df71405cd5a0ba2888f08b24c8ee6c6a90dc20e8a35decca753',
      'isFinalized': false,
      'index': 0,
      'blockNumber': 22070335,
    },
  ],
  '22070336': [
    {
      'blockHash': '0xf522395087a21fea1968a896d052afb0ac80fdff1fdb5a1781fb91e7e2a3d1df',
      'parentBlockHash': '0x74f4fed8e90c971456bec02092fea809c27ad5110e6c791acf71fbd8bc938d5e',
      'isFinalized': false,
      'index': 0,
      'blockNumber': 22070336,
    },
  ],
};
