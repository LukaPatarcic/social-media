<?php

namespace App\Repository;

use App\Entity\Comment;
use App\Entity\Post;
use App\Entity\SubComment;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\ORM\NonUniqueResultException;

/**
 * @method SubComment|null find($id, $lockMode = null, $lockVersion = null)
 * @method SubComment|null findOneBy(array $criteria, array $orderBy = null)
 * @method SubComment[]    findAll()
 * @method SubComment[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SubCommentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SubComment::class);
    }


    /**
     * @param Comment $comment
     * @param User $user
     * @param int $limit
     * @param int $offset
     * @param string $sort
     * @return mixed
     */
    public function findByComment(Comment $comment, $limit = 3, $offset = 0, $sort = 'ASC')
    {
        return $this->createQueryBuilder('sc')
            ->select('sc.id, u.firstName, u.lastName, u.profileName, u.profilePicture, u.id as userId, sc.text, sc.createdAt')
            ->andWhere('sc.comment = :comment')
            ->join('sc.user', 'u')
            ->setParameter('comment', $comment)
            ->orderBy('sc.createdAt', $sort)
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();


    }
}
