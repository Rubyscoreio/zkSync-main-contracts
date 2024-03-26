import { HardhatEthersSigner } from "@test-utils";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Rubyscore_Profile, Rubyscore_Profile__factory } from "@contracts";

describe("Getters and updates: ", () => {
  let deployer: HardhatEthersSigner,
    admin: HardhatEthersSigner,
    operator: HardhatEthersSigner,
    user: HardhatEthersSigner;
  let XProjectSBTInstance: Rubyscore_Profile__factory;
  let soulBoundTokenContract: Rubyscore_Profile;
  let OPERATOR_ROLE: string;

  before(async () => {
    [deployer, admin, operator, user] = await ethers.getSigners();
    XProjectSBTInstance = await ethers.getContractFactory("Rubyscore_Profile");
  });

  describe("When one of parameters is incorrect", () => {
    before(async () => {
      soulBoundTokenContract = await XProjectSBTInstance.connect(deployer).deploy(
        admin.address,
        operator.address,
      );
      OPERATOR_ROLE = await soulBoundTokenContract.OPERATOR_ROLE();
    });

    it("Method updateBaseURI: should reverted when caller have not role", async () => {
      const newURI = "ipfs://new_uri";

      await expect(soulBoundTokenContract.connect(user).updateBaseURI(newURI))
        .to.be.revertedWithCustomError(soulBoundTokenContract, "AccessControlUnauthorizedAccount")
        .withArgs(user.address, OPERATOR_ROLE);
    });

    it("Method updateBaseExtension: should reverted when caller have not role", async () => {
      const newBaseExtension = ".xml";

      await expect(soulBoundTokenContract.connect(user).updateBaseExtension(newBaseExtension))
        .to.be.revertedWithCustomError(soulBoundTokenContract, "AccessControlUnauthorizedAccount")
        .withArgs(user.address, OPERATOR_ROLE);
    });

    it("Method getIdByOwner: should reverted when user have not NFT", async () => {
      await expect(soulBoundTokenContract.connect(user).getIdByOwner(user.address)).to.be.rejectedWith(
        "User does not have a name",
      );
    });

    it("Method getIdByOwner: should reverted when NFT not exist", async () => {
      const tokenId = 123321;
      await expect(soulBoundTokenContract.tokenURI(tokenId)).to.be.rejectedWith(
        "URI query for nonexistent token",
      );
    });

    it("Method getNameByOwner: should reverted when user  do not have name", async () => {
      await expect(soulBoundTokenContract.getNameByOwner(deployer.address)).to.be.rejectedWith(
        "User does not have a name",
      );
    });
  });

  describe("When all parameters correct", () => {
    before(async () => {
      soulBoundTokenContract = await XProjectSBTInstance.connect(deployer).deploy(
        admin.address,
        operator.address,
      );
    });

    it("Method updateBaseURI: should update BaseURI", async () => {
      const oldURI = await soulBoundTokenContract.getBaseURI();
      const newURI = "ipfs://new_uri";
      await soulBoundTokenContract.connect(operator).updateBaseURI(newURI);
      const baseURI = await soulBoundTokenContract.getBaseURI();

      expect(oldURI).to.be.not.eq(newURI);
      expect(baseURI).to.be.eq(newURI);
    });

    it("Method updateBaseExtension: should update BaseExtension", async () => {
      const oldBaseExtension = await soulBoundTokenContract.getBaseExtension();
      const newBaseExtension = ".xml";
      await soulBoundTokenContract.connect(operator).updateBaseExtension(newBaseExtension);
      const baseExtension = await soulBoundTokenContract.getBaseExtension();

      expect(oldBaseExtension).to.be.not.eq(newBaseExtension);
      expect(baseExtension).to.be.eq(newBaseExtension);
    });

    it("Method getOwnerByName: should return address(0) if name does not claimed", async () => {
      const ownerAddress = await soulBoundTokenContract.getOwnerByName("not_existing_name");
      expect(ownerAddress).to.be.eq(ethers.ZeroAddress);
    });

    it("Method getNameById: should return emty string if name does not claimed and id not exist", async () => {
      const name = await soulBoundTokenContract.getNameById(1234567890);
      expect(name).to.be.eq("");
    });
  });
});
