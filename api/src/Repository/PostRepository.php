<?php

namespace App\Repository;

use App\Entity\Friendship;
use App\Entity\Post;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\ORM\Query\Expr;
use Doctrine\ORM\Query\Expr\Join;

/**
 * @method Post|null find($id, $lockMode = null, $lockVersion = null)
 * @method Post|null findOneBy(array $criteria, array $orderBy = null)
 * @method Post[]    findAll()
 * @method Post[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PostRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Post::class);
    }

    // /**
    //  * @return Post[] Returns an array of Post objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('p.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */
    public function findFeedPosts(User $user,$limit = 10,$offset = 0)
    {
        return $this->createQueryBuilder('p')
//            ->select('p.id, p.text, p.createdAt, COUNT(lp.id) as likes, u.firstName, u.lastName, u.profileName')
//            ->addSelect('(SELECT l.id FROM App\Entity\LikePost l WHERE l.user = :user and l.post = p) as liked')
            ->join('p.user','u')
            ->join('p.likePosts','lp')
            ->join('u.friends','uf')
            ->andWhere('p.user != :user')
            ->setParameter('user', $user)
            ->orderBy('p.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult()
            ;
    }

    public function findUsersPosts(User $user)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.user = :id')
            ->join('p.user','u')
            ->setParameter('id', $user->getId())
            ->orderBy('p.createdAt', 'DESC')
            ->getQuery()
            ->getResult()
            ;

    }

    /*
    public function findOneBySomeField($value): ?Post
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
