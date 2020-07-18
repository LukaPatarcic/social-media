<?php

namespace App\Repository;

use App\Entity\LikePost;
use App\Entity\Post;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method LikePost|null find($id, $lockMode = null, $lockVersion = null)
 * @method LikePost|null findOneBy(array $criteria, array $orderBy = null)
 * @method LikePost[]    findAll()
 * @method LikePost[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class LikePostRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, LikePost::class);
    }

    public function findIfUserLikedPost(User $user, Post $post)
    {
        return $this->createQueryBuilder('l')
            ->andWhere('l.user = :user')
            ->andWhere('l.post = :post')
            ->setParameter('user', $user)
            ->setParameter('post', $post)
            ->getQuery()
            ->getResult()
        ;
    }

    public function findByPost(Post $post,$offset = 0, $limit = 10, $sort = 'DESC')
    {
        return $this->createQueryBuilder('l')
            ->select('lu.firstName, lu.lastName, lu.profilePicture, lu.profileName, l.createdAt')
            ->join('l.user','lu')
            ->andWhere('l.post = :post')
            ->setParameter('post',$post)
            ->orderBy('l.createdAt',$sort)
            ->setFirstResult($offset)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
}
