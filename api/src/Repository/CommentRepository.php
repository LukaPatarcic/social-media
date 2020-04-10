<?php

namespace App\Repository;

use App\Entity\Comment;
use App\Entity\Post;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\Query;

/**
 * @method Comment|null find($id, $lockMode = null, $lockVersion = null)
 * @method Comment|null findOneBy(array $criteria, array $orderBy = null)
 * @method Comment[]    findAll()
 * @method Comment[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CommentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Comment::class);
    }

    /**
     * @param Post $post
     * @param User $user
     * @param int $limit
     * @param int $offset
     * @param string $sort
     * @return mixed
     * @throws NonUniqueResultException
     */
    public function findByPost(Post $post,User $user,$limit = 10,$offset = 0,$sort = 'ASC')
    {
        $q = $this->createQueryBuilder('c')
            ->select('c.id, u.firstName, u.lastName, u.profileName, c.text, c.createdAt, COUNT(l.id) as likes')
            ->addSelect('(SELECT lk.id FROM App\Entity\CommentLike lk WHERE lk.user = :user and lk.comment = c.id) as liked')
            ->andWhere('c.post = :post')
            ->join('c.user','u')
            ->leftJoin('c.likes','l')
            ->setParameter('post', $post)
            ->setParameter('user',$user)
            ->orderBy('c.createdAt', $sort)
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->groupBy('c.id');

        if($limit === 1) {
            return $q->getQuery()
                ->getOneOrNullResult();
        } else {
            return $q->getQuery()
                ->getResult();
        }


    }

    /*
    public function findOneBySomeField($value): ?Comment
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
