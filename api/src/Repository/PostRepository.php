<?php

namespace App\Repository;

use App\Entity\Friendship;
use App\Entity\Post;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\DBAL\FetchMode;
use Doctrine\ORM\Query\Expr;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\ORM\Query\ResultSetMapping;

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
    public function findPosts(User $user,$limit = 10,$offset = 0,$profile = null)
    {
        $em = $this->getEntityManager()->getConnection();
        try {
            $stm = $em->prepare("
                SELECT
                p.id as postId,p.id as id,p.text,p.created_at as createdAt,u.first_name as firstName,u.last_name as lastName,
                u.profile_name as profileName, u.profile_picture as profilePicture, p.images as images,
                (SELECT l.id IS NOT NULL FROM like_post l JOIN post p ON p.id = l.post_id WHERE l.user_id = :user AND l.post_id = postId) as liked,
                (SELECT COUNT(c.id) FROM comment c JOIN post p ON p.id = c.post_id WHERE c.post_id = postId) as commentCount,
                (SELECT COUNT(l.id) as likes FROM like_post l JOIN post p ON p.id = l.post_id WHERE l.post_id = postId) as likes
                FROM post p
                JOIN user u ON p.user_id = u.id
                ".($profile ? " " : "JOIN friendship f ON u.id = f.friend_id").
                ($profile ? " WHERE p.user_id= :profile " : " WHERE p.user_id != :user AND f.user_id = :user ")
                ."ORDER BY p.created_at DESC
                LIMIT :limit
                OFFSET :offset
                ");
        } catch (DBALException $e) {
            return ['error' => $e->getMessage()];
        }
        $id = $profile === $user->getId() ? $user->getId() : $profile;
        $stm->bindValue('user',$user->getId());
        if($profile) {
            $stm->bindParam('profile',$id);
        }
        $stm->bindValue('limit',(int)$limit,\PDO::PARAM_INT);
        $stm->bindValue('offset',(int)$offset,\PDO::PARAM_INT);
        $stm->execute();

        return $stm->fetchAll(FetchMode::ASSOCIATIVE);
    }

    public function findPostLikes($id,$offset = 0,$limit = 10,$sort = 'ASC')
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $id)
            ->orderBy('p.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
            ;
    }
}
