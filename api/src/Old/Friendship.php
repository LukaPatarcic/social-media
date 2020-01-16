<?php
//
//namespace App\Entity;
//
//use Doctrine\Common\Collections\ArrayCollection;
//use Doctrine\Common\Collections\Collection;
//use Doctrine\ORM\Mapping as ORM;
//use Gedmo\Timestampable\Traits\TimestampableEntity;
//use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
//
///**
// * @ORM\Entity(repositoryClass="App\Repository\FriendshipRepository")
// * @UniqueEntity(fields={"user","friend"}, message="Already following that person")
// */
//class Friendship
//{
//
//    use TimestampableEntity;
//    /**
//     * @ORM\Id()
//     * @ORM\GeneratedValue()
//     * @ORM\Column(type="integer")
//     */
//    private $id;
//
//    /**
//     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="friends")
//     */
//    private $user;
//
//    /**
//     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="friendsWithMe")
//     */
//    private $friend;
//
//    /**
//     * @ORM\Column(type="boolean")
//     */
//    private $status = false;
//
//    public function __construct()
//    {
//        $this->user = new ArrayCollection();
//        $this->friend = new ArrayCollection();
//    }
//
//    public function getId(): ?int
//    {
//        return $this->id;
//    }
//
//    public function getUser(): ArrayCollection
//    {
//        return $this->user;
//    }
//
//    public function setUser(?User $user): self
//    {
//        $this->user = $user;
//
//        return $this;
//    }
//
//    public function getFriend(): ArrayCollection
//    {
//        return $this->friend;
//    }
//
//    public function setFriend(?User $friend): self
//    {
//        $this->friend = $friend;
//
//        return $this;
//    }
//
//    public function getStatus(): ?bool
//    {
//        return $this->status;
//    }
//
//    public function setStatus(bool $status): self
//    {
//        $this->status = $status;
//
//        return $this;
//    }
//
////    public function addUser(user $user): self
////    {
////        if (!$this->user->contains($user)) {
////            $this->user[] = $user;
////            $user->set($this);
////        }
////
////        return $this;
////    }
////
////    public function removeUser(user $user): self
////    {
////        if ($this->user->contains($user)) {
////            $this->user->removeElement($user);
////            // set the owning side to null (unless already changed)
////            if ($user->getTest() === $this) {
////                $user->setTest(null);
////            }
////        }
////
////        return $this;
////    }
////
////    public function addFriend(User $friend): self
////    {
////        if (!$this->friend->contains($friend)) {
////            $this->friend[] = $friend;
////            $friend->setTest($this);
////        }
////
////        return $this;
////    }
////
////    public function removeFriend(User $user): self
////    {
////        if ($this->user->contains($user)) {
////            $this->user->removeElement($user);
////            // set the owning side to null (unless already changed)
////            if ($user->getTest() === $this) {
////                $user->setTest(null);
////            }
////        }
////
////        return $this;
////    }
//}
