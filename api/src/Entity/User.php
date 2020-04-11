<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Timestampable\Traits\TimestampableEntity;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 * @UniqueEntity(fields={"email"}, message="That email is already registered")
 * @UniqueEntity(fields={"profileName"}, message="That username is already registered")
 */
class User implements UserInterface
{
    use TimestampableEntity;
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"search","user_info","myFriends"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     * @Assert\NotBlank(message="Please enter an email address")
     * @Assert\Email(message="Please enter a valid email address")
     * @Groups("user_info")
     */
    private $email;

    /**
     * @ORM\Column(type="json")
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     */
    private $password;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\Length(
     *     max="50",
     *     maxMessage="Max number of characters is 255 characters",
     *     min="2",
     *     minMessage="Your first name should be at least 2 characters"
     * )
     * @Assert\NotBlank(message="Please enter your first name")
     * @Groups({"user_info","search","myFriends"})
     */
    private $firstName;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\Length(
     *     max="50",
     *     maxMessage="Max number of characters is 255 characters",
     *     min="2",
     *     minMessage="Your last name should be at least 2 characters"
     * )
     * @Assert\NotBlank(message="Please enter your last name")
     * @Groups({"user_info","search","myFriends"})
     */
    private $lastName;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\Length(
     *     max="20",
     *     maxMessage="Max number of characters is 255 characters",
     *     min="2",
     *     minMessage="Your username should be at least 2 characters"
     * )
     * @Assert\Regex(pattern="/^[a-zA-Z0-9]+$/", message="The profile name may only contain letters and numbers.")
     * @Groups({"user_info","search","myFriends"})
     */
    private $profileName;

    /**
     * @ORM\Column(type="boolean")
     */
    private $isVerified = 0;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $verificationCode;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $deletesIn;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Friendship", mappedBy="user")
     * @Groups({"search"})
     */
    private $friends;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Friendship", mappedBy="friend")
     * @Groups({"search"})
     */
    private $friendsWithMe;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\FriendshipRequest", mappedBy="fromUser")
     */
    private $fromUser;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\FriendshipRequest", mappedBy="toUser")
     */
    private $toUser;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\PushNotification", mappedBy="user")
     */
    private $pushNotifications;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Post", mappedBy="user")
     */
    private $posts;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\LikePost", mappedBy="user")
     */
    private $likePosts;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Comment", mappedBy="user")
     */
    private $comments;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\CommentLike", mappedBy="user")
     */
    private $commentLikes;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\SubComment", mappedBy="user")
     */
    private $subComments;

    public function __construct()
    {
        $this->friends = new ArrayCollection();
        $this->friendsWithMe = new ArrayCollection();
        $this->fromUser = new ArrayCollection();
        $this->toUser = new ArrayCollection();
        $this->pushNotifications = new ArrayCollection();
        $this->posts = new ArrayCollection();
        $this->likePosts = new ArrayCollection();
        $this->comments = new ArrayCollection();
        $this->commentLikes = new ArrayCollection();
        $this->subComments = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(?string $firstName): self
    {
        $this->firstName = strtoupper(strtolower($firstName));

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(?string $lastName): self
    {
        $this->lastName = strtoupper(strtolower($lastName));

        return $this;
    }

    public function getProfileName(): ?string
    {
        return $this->profileName;
    }

    public function setProfileName(?string $profileName): self
    {
        $this->profileName = $profileName;

        return $this;
    }

    public function getIsVerified(): ?bool
    {
        return $this->isVerified;
    }

    public function setIsVerified(bool $isVerified): self
    {
        $this->isVerified = $isVerified;

        return $this;
    }

    public function getVerificationCode(): ?string
    {
        return $this->verificationCode;
    }

    public function setVerificationCode(?string $verificationCode): self
    {
        $this->verificationCode = $verificationCode;

        return $this;
    }

    public function getDeletesIn(): ?\DateTimeInterface
    {
        return $this->deletesIn;
    }

    public function setDeletesIn(?\DateTimeInterface $deletesIn = null): self
    {
        $this->deletesIn = $deletesIn ? new \DateTime('+ 1 day') : null;

        return $this;
    }

    /**
     * @return Collection|Friendship[]
     */
    public function getFriends(): Collection
    {
        return $this->friends;
    }

    public function addFriend(Friendship $friend): self
    {
        if (!$this->friends->contains($friend)) {
            $this->friends[] = $friend;
            $friend->setUser($this);
        }

        return $this;
    }

    public function removeFriend(Friendship $friend): self
    {
        if ($this->friends->contains($friend)) {
            $this->friends->removeElement($friend);
            // set the owning side to null (unless already changed)
            if ($friend->getUser() === $this) {
                $friend->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Friendship[]
     */
    public function getFriendsWithMe(): Collection
    {
        return $this->friendsWithMe;
    }

    public function addFriendsWithMe(Friendship $friendsWithMe): self
    {
        if (!$this->friendsWithMe->contains($friendsWithMe)) {
            $this->friendsWithMe[] = $friendsWithMe;
            $friendsWithMe->setFriend($this);
        }

        return $this;
    }

    public function removeFriendsWithMe(Friendship $friendsWithMe): self
    {
        if ($this->friendsWithMe->contains($friendsWithMe)) {
            $this->friendsWithMe->removeElement($friendsWithMe);
            // set the owning side to null (unless already changed)
            if ($friendsWithMe->getFriend() === $this) {
                $friendsWithMe->setFriend(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|FriendshipRequest[]
     */
    public function getFromUser(): Collection
    {
        return $this->fromUser;
    }

    public function addFromUser(FriendshipRequest $fromUser): self
    {
        if (!$this->fromUser->contains($fromUser)) {
            $this->fromUser[] = $fromUser;
            $fromUser->setFromUser($this);
        }

        return $this;
    }

    public function removeFromUser(FriendshipRequest $fromUser): self
    {
        if ($this->fromUser->contains($fromUser)) {
            $this->fromUser->removeElement($fromUser);
            // set the owning side to null (unless already changed)
            if ($fromUser->getFromUser() === $this) {
                $fromUser->setFromUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|FriendshipRequest[]
     */
    public function getToUser(): Collection
    {
        return $this->toUser;
    }

    public function addToUser(FriendshipRequest $toUser): self
    {
        if (!$this->toUser->contains($toUser)) {
            $this->toUser[] = $toUser;
            $toUser->setToUser($this);
        }

        return $this;
    }

    public function removeToUser(FriendshipRequest $toUser): self
    {
        if ($this->toUser->contains($toUser)) {
            $this->toUser->removeElement($toUser);
            // set the owning side to null (unless already changed)
            if ($toUser->getToUser() === $this) {
                $toUser->setToUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|PushNotification[]
     */
    public function getPushNotifications(): Collection
    {
        return $this->pushNotifications;
    }

    public function addPushNotification(PushNotification $pushNotification): self
    {
        if (!$this->pushNotifications->contains($pushNotification)) {
            $this->pushNotifications[] = $pushNotification;
            $pushNotification->setUser($this);
        }

        return $this;
    }

    public function removePushNotification(PushNotification $pushNotification): self
    {
        if ($this->pushNotifications->contains($pushNotification)) {
            $this->pushNotifications->removeElement($pushNotification);
            // set the owning side to null (unless already changed)
            if ($pushNotification->getUser() === $this) {
                $pushNotification->setUser(null);
            }
        }

        return $this;
    }

    public function isFriendWithMe(User $me)
    {
        if($me->getId() == $this->getId()) {
            return true;
        }
        return false;
    }

    /**
     * @return Collection|Post[]
     */
    public function getPosts(): Collection
    {
        return $this->posts;
    }

    public function addPost(Post $post): self
    {
        if (!$this->posts->contains($post)) {
            $this->posts[] = $post;
            $post->setUser($this);
        }

        return $this;
    }

    public function removePost(Post $post): self
    {
        if ($this->posts->contains($post)) {
            $this->posts->removeElement($post);
            // set the owning side to null (unless already changed)
            if ($post->getUser() === $this) {
                $post->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|LikePost[]
     */
    public function getLikePosts(): Collection
    {
        return $this->likePosts;
    }

    public function addLikePost(LikePost $likePost): self
    {
        if (!$this->likePosts->contains($likePost)) {
            $this->likePosts[] = $likePost;
            $likePost->setUser($this);
        }

        return $this;
    }

    public function removeLikePost(LikePost $likePost): self
    {
        if ($this->likePosts->contains($likePost)) {
            $this->likePosts->removeElement($likePost);
            // set the owning side to null (unless already changed)
            if ($likePost->getUser() === $this) {
                $likePost->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Comment[]
     */
    public function getComments(): Collection
    {
        return $this->comments;
    }

    public function addComment(Comment $comment): self
    {
        if (!$this->comments->contains($comment)) {
            $this->comments[] = $comment;
            $comment->setUser($this);
        }

        return $this;
    }

    public function removeComment(Comment $comment): self
    {
        if ($this->comments->contains($comment)) {
            $this->comments->removeElement($comment);
            // set the owning side to null (unless already changed)
            if ($comment->getUser() === $this) {
                $comment->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|CommentLike[]
     */
    public function getCommentLikes(): Collection
    {
        return $this->commentLikes;
    }

    public function addCommentLike(CommentLike $commentLike): self
    {
        if (!$this->commentLikes->contains($commentLike)) {
            $this->commentLikes[] = $commentLike;
            $commentLike->setUser($this);
        }

        return $this;
    }

    public function removeCommentLike(CommentLike $commentLike): self
    {
        if ($this->commentLikes->contains($commentLike)) {
            $this->commentLikes->removeElement($commentLike);
            // set the owning side to null (unless already changed)
            if ($commentLike->getUser() === $this) {
                $commentLike->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|SubComment[]
     */
    public function getSubComments(): Collection
    {
        return $this->subComments;
    }

    public function addSubComment(SubComment $subComment): self
    {
        if (!$this->subComments->contains($subComment)) {
            $this->subComments[] = $subComment;
            $subComment->setUser($this);
        }

        return $this;
    }

    public function removeSubComment(SubComment $subComment): self
    {
        if ($this->subComments->contains($subComment)) {
            $this->subComments->removeElement($subComment);
            // set the owning side to null (unless already changed)
            if ($subComment->getUser() === $this) {
                $subComment->setUser(null);
            }
        }

        return $this;
    }
}
