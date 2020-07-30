<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Timestampable\Traits\TimestampableEntity;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CommentRepository")
 */
class Comment
{
    use TimestampableEntity;
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=50)
     * @Assert\Length(
     *     max="50",
     *     maxMessage="Max number of characters is 50 characters",
     *     min="1",
     *     minMessage="Please eneter a comment"
     * )
     */
    private $text;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="comments", fetch="EXTRA_LAZY")
     * @ORM\JoinColumn(nullable=false)
     */
    private $user;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Post", inversedBy="comments", fetch="EXTRA_LAZY")
     * @ORM\JoinColumn(nullable=false)
     */
    private $post;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\CommentLike", mappedBy="comment", fetch="EXTRA_LAZY", cascade={"remove"})
     */
    private $likes;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\SubComment", mappedBy="comment", cascade={"remove"})
     */
    private $subComments;

    public function __construct()
    {
        $this->likes = new ArrayCollection();
        $this->subComments = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getText(): ?string
    {
        return $this->text;
    }

    public function setText(string $text): self
    {
        $this->text = $text;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getPost(): ?Post
    {
        return $this->post;
    }

    public function setPost(?Post $post): self
    {
        $this->post = $post;

        return $this;
    }

    /**
     * @return Collection|CommentLike[]
     */
    public function getLikes(): Collection
    {
        return $this->likes;
    }

    public function addLike(CommentLike $like): self
    {
        if (!$this->likes->contains($like)) {
            $this->likes[] = $like;
            $like->setComment($this);
        }

        return $this;
    }

    public function removeLike(CommentLike $like): self
    {
        if ($this->likes->contains($like)) {
            $this->likes->removeElement($like);
            // set the owning side to null (unless already changed)
            if ($like->getComment() === $this) {
                $like->setComment(null);
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
            $subComment->setComment($this);
        }

        return $this;
    }

    public function removeSubComment(SubComment $subComment): self
    {
        if ($this->subComments->contains($subComment)) {
            $this->subComments->removeElement($subComment);
            // set the owning side to null (unless already changed)
            if ($subComment->getComment() === $this) {
                $subComment->setComment(null);
            }
        }

        return $this;
    }
}
