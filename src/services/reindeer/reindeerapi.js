import axios from "axios";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

// const URL = import.meta.env.VITE_API_URL;
const API_URL = import.meta.env.VITE_PROD_API_URL;

export const useReindeers = () => {
  return useQuery({
    queryKey: ["reindeers"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}api/reindeer`);
      return data.data;
    },
  });
};

export const useAddReindeer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newReindeer) => {
      const formattedData = {
        ...newReindeer,
        skills: newReindeer.skills.map((s) => ({
          ...s,
          value: Number(s.value),
        })),
      };
      return axios.post(`${API_URL}api/reindeer`, formattedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reindeers"] });
    },
  });
};

export const useUpdateReindeer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedReindeer) => {
      const { id, skills, ...reindeerData } = updatedReindeer;
      const formattedData = {
        ...reindeerData,
        id: Number(id),
        skills: skills.map((s) => ({
          skill: s.skill,
          value: Number(s.value),
        })),
      };
      return axios.put(
        `${API_URL}api/reindeer/${formattedData.id}`,
        formattedData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reindeers"] });
    },
  });
};

export const useUpdateCheckedReindeers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedCheckedReindeers) =>
      axios.all(
        updatedCheckedReindeers.map((reindeer) => {
          const formattedData = {
            ...reindeer,
            id: Number(reindeer.id),
            skills: reindeer.skills.map((s) => ({
              ...s,
              value: Number(s.value),
            })),
          };
          return axios.put(
            `${API_URL}api/reindeer/${formattedData.id}`,
            formattedData
          );
        })
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reindeers"] });
    },
  });
};

export const useDeleteReindeer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (deletedReindeer) =>
      axios.delete(`${API_URL}api/reindeer/${Number(deletedReindeer.id)}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reindeers"] });
      queryClient.refetchQueries(["organizations"]);
    },
  });
};

export const useDeleteCheckedReindeer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (deletedCheckedReindeer) =>
      axios.all(
        deletedCheckedReindeer.map((reindeer) =>
          axios.delete(`${API_URL}api/reindeer/${Number(reindeer.id)}`)
        )
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reindeers"] });
      queryClient.refetchQueries(["organizations"]);
    },
  });
};
