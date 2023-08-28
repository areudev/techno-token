import {expect} from 'chai'
import {ethers} from 'hardhat'
import {TokenERC20} from '../typechain-types'
import {SignerWithAddress} from '@nomicfoundation/hardhat-ethers/signers'
import {INITIAL_SUPPLY} from '../helpers'

describe('Techno ERC20', () => {
  let TechnoToken: TokenERC20
  let deplpoyer: SignerWithAddress
  let user1: SignerWithAddress

  beforeEach(async () => {
    const accounts = await ethers.getSigners()
    deplpoyer = accounts[0]
    user1 = accounts[1]

    const TechnoTokenFactory = await ethers.getContractFactory('TokenERC20')
    TechnoToken = await TechnoTokenFactory.deploy(
      ethers.parseEther(INITIAL_SUPPLY),
      'TECHNO',
      'TECHNO',
    )
    await TechnoToken.waitForDeployment()
  })

  it('Should return the right name and symbol', async () => {
    expect(await TechnoToken.name()).to.equal('TECHNO')
    expect(await TechnoToken.symbol()).to.equal('TECHNO')
  })

  it('Should return the right total supply', async () => {
    expect(await TechnoToken.totalSupply()).to.equal(
      ethers.parseEther(INITIAL_SUPPLY),
    )
  })

  it('Should return the right balance for the deployer', async () => {
    expect(await TechnoToken.balanceOf(deplpoyer.address)).to.equal(
      ethers.parseEther(INITIAL_SUPPLY),
    )
  })

  it('Should transfer tokens between accounts', async () => {
    const amount = ethers.parseEther('1')
    await TechnoToken.transfer(user1.address, amount)
    expect(await TechnoToken.balanceOf(user1.address)).to.equal(amount)

    await TechnoToken.connect(user1).transfer(deplpoyer.address, amount)
    expect(await TechnoToken.balanceOf(deplpoyer.address)).to.equal(
      ethers.parseEther(INITIAL_SUPPLY),
    )
  })

  it('Should fail if the sender doesn’t have enough tokens', async () => {
    const amount = ethers.parseEther('1')

    await expect(TechnoToken.connect(user1).transfer(deplpoyer.address, amount))
      .to.be.reverted
  })

  it('Should update balances after transfers', async () => {
    const amount = ethers.parseEther('1')
    await TechnoToken.transfer(user1.address, amount)

    expect(await TechnoToken.balanceOf(user1.address)).to.equal(amount)
    expect(await TechnoToken.balanceOf(deplpoyer.address)).to.equal(
      ethers.parseEther(INITIAL_SUPPLY) - amount,
    )
  })

  it('Should approve other address to spend token', async () => {
    const amount = ethers.parseEther('5')
    await TechnoToken.approve(user1.address, amount)
    const approvedAmount = await TechnoToken.allowance(
      deplpoyer.address,
      user1.address,
    )
    expect(approvedAmount).to.equal(amount)
  })
})
