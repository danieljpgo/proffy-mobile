import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import Card from '../../common/components/Card';
import Header from '../../common/layout/Header';
import asyncStorage from '../../common/utils/asyncStorage';
import { Teacher } from '../Teachers/types';

import { Container, Content } from './styles';

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Teacher[]>([]);

  useFocusEffect(() => {
    async function getFavoritesTeachers() {
      const favoriteds = await asyncStorage.get<Teacher[]>('favorites');
      if (favoriteds) {
        setFavorites(favoriteds);
      }
    }

    getFavoritesTeachers();
  });

  function handleToggleFavorite(
    favoritedTeacher: Teacher,
    favoriteds: Teacher[]
  ) {
    const { id } = favoritedTeacher;
    const hasFavorited = !!favoriteds.find((teacher) => teacher.id === id);

    if (hasFavorited) {
      setFavorites((prev) => prev.filter((favorite) => favorite.id !== id));
      asyncStorage.set<Teacher[]>(
        'favorites',
        favoriteds.filter((favorite) => favorite.id !== id)
      );
    } else {
      setFavorites((prev) => [...prev, favoritedTeacher]);
      asyncStorage.set<Teacher[]>('favorites', [
        ...favoriteds,
        favoritedTeacher,
      ]);
    }
  }

  return (
    <Container>
      <Header title="Meus proffys favoritos" />
      <Content>
        {favorites &&
          favorites.map((teacher) => (
            <Card
              key={teacher.id}
              teacher={teacher}
              favorited={!!favorites.find((f) => f.id === teacher.id)}
              onFavorite={(favoritedTeacher) =>
                handleToggleFavorite(favoritedTeacher, favorites)
              }
            />
          ))}
      </Content>
    </Container>
  );
};

export default Favorites;
