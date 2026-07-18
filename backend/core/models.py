from django.conf import settings
from django.db import models


class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.name


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    offers = models.ManyToManyField(Skill, related_name='offered_by', blank=True)
    wants = models.ManyToManyField(Skill, related_name='wanted_by', blank=True)

    def __str__(self):
        return self.user.username


class SwipeAction(models.Model):
    LIKE, DISLIKE = 'like', 'dislike'
    CHOICES = [(LIKE, 'Like'), (DISLIKE, 'Dislike')]

    from_user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='swipes_made', on_delete=models.CASCADE)
    to_user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='swipes_received', on_delete=models.CASCADE)
    action = models.CharField(max_length=10, choices=CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('from_user', 'to_user')


class Match(models.Model):
    user_a = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='matches_a', on_delete=models.CASCADE)
    user_b = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='matches_b', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)