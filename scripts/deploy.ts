import {ethers} from 'hardhat'
import {INITIAL_SUPPLY} from '../helpers'

async function main() {
  const [deployer] = await ethers.getSigners()

  console.log(
    'Deploying the contracts with the account:',
    await deployer.getAddress(),
  )

  const Techno = await ethers.getContractFactory('Techno')

  const technoToken = await Techno.deploy(ethers.parseEther(INITIAL_SUPPLY))

  await technoToken.waitForDeployment()

  console.log('Techno Token deployed to:', technoToken.target)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
